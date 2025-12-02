import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import fs from 'fs'
import crypto from 'crypto'
import path from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Login attempt tracking (rate limiting)
const loginAttempts = new Map()
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5
function makeKey(email, ip) { return `${(email || '').toLowerCase()}|${ip}` }
function getAttempts(email, ip) {
  const key = makeKey(email, ip)
  const now = Date.now()
  const arr = (loginAttempts.get(key) || []).filter(ts => now - ts < ATTEMPT_WINDOW_MS)
  loginAttempts.set(key, arr)
  return arr
}
function recordAttempt(email, ip) {
  const key = makeKey(email, ip)
  const arr = getAttempts(email, ip)
  arr.push(Date.now())
  loginAttempts.set(key, arr)
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
})

// Helpers
async function query(sql, params) {
  // Use pool.query so multi-statement scripts (e.g. install schema + seed) run correctly
  const [rows] = await pool.query(sql, params)
  return rows
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev')
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

// Ensure an initial admin user exists if configured
;(async function ensureAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const full_name = process.env.ADMIN_FULL_NAME || 'Administrator'
    if (!email || !password) return
    const rows = await query('SELECT id FROM wahl_users WHERE email=? AND role=?', [email, 'admin'])
    if (!rows.length) {
      const id = crypto.randomUUID().replace(/-/g, '')
      const hash = await bcrypt.hash(password, 10)
      await query('INSERT INTO wahl_users (id,email,full_name,role,password_hash) VALUES (?,?,?,?,?)', [id, email, full_name, 'admin', hash])
      console.log('Admin user initialized')
    }
  } catch (e) {
    // silent
  }
})()

// Site settings
app.get('/api/site-settings', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM wahl_site_settings ORDER BY updated_at DESC LIMIT 1')
    res.json(rows[0] || null)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.put('/api/site-settings', async (req, res) => {
  try {
    const { site_name = 'WAHL', phone, email, location } = req.body
    // upsert single row
    const rows = await query('SELECT id FROM wahl_site_settings ORDER BY updated_at DESC LIMIT 1')
    if (rows.length) {
      await query('UPDATE wahl_site_settings SET site_name=?, phone=?, email=?, location=?, logo_url=COALESCE(?, logo_url), header_brand_text=COALESCE(?, header_brand_text), footer_brand_text=COALESCE(?, footer_brand_text), social_facebook=COALESCE(?, social_facebook), social_twitter=COALESCE(?, social_twitter), social_linkedin=COALESCE(?, social_linkedin), social_instagram=COALESCE(?, social_instagram), updated_at=NOW() WHERE id=?', [site_name, phone, email, location, req.body.logo_url || null, req.body.header_brand_text || null, req.body.footer_brand_text || null, req.body.social_facebook || null, req.body.social_twitter || null, req.body.social_linkedin || null, req.body.social_instagram || null, rows[0].id])
      const updated = await query('SELECT * FROM wahl_site_settings WHERE id=?', [rows[0].id])
      res.json(updated[0])
    } else {
      const id = crypto.randomUUID().replace(/-/g, '')
      await query('INSERT INTO wahl_site_settings (id, site_name, phone, email, location, logo_url, header_brand_text, footer_brand_text, social_facebook, social_twitter, social_linkedin, social_instagram) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [id, site_name, phone, email, location, req.body.logo_url || null, req.body.header_brand_text || null, req.body.footer_brand_text || null, req.body.social_facebook || null, req.body.social_twitter || null, req.body.social_linkedin || null, req.body.social_instagram || null])
      const latest = await query('SELECT * FROM wahl_site_settings ORDER BY updated_at DESC LIMIT 1')
      res.json(latest[0])
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/admin/migrate-site-settings', async (req, res) => {
  try {
    const token = req.headers['x-install-token']
    if (!process.env.INSTALL_TOKEN || token !== process.env.INSTALL_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
    const columns = [
      ['logo_url', 'TEXT'],
      ['header_brand_text', 'TEXT'],
      ['footer_brand_text', 'TEXT'],
      ['social_facebook', 'TEXT'],
      ['social_twitter', 'TEXT'],
      ['social_linkedin', 'TEXT'],
      ['social_instagram', 'TEXT'],
    ]
    for (const [name, type] of columns) {
      const exists = await query('SELECT 1 FROM information_schema.columns WHERE table_schema=? AND table_name=? AND column_name=?', [process.env.MYSQL_DATABASE, 'wahl_site_settings', name])
      if (!exists.length) {
        await query(`ALTER TABLE wahl_site_settings ADD COLUMN ${name} ${type}`)
      }
    }
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Hero slides
app.get('/api/hero-slides', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM wahl_hero_slides WHERE active=1 ORDER BY sort_order ASC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/hero-slides', async (req, res) => {
  try {
    const { image_url, title = null, subtitle = null, sort_order = 0, active = 1 } = req.body
    const id = crypto.randomUUID().replace(/-/g, '')
    await query('INSERT INTO wahl_hero_slides (id, image_url, title, subtitle, sort_order, active) VALUES (?,?,?,?,?,?)', [id, image_url, title, subtitle, sort_order, active ? 1 : 0])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.delete('/api/hero-slides/:id', async (req, res) => {
  try {
    await query('DELETE FROM wahl_hero_slides WHERE id=?', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Clients
app.get('/api/clients', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM wahl_clients WHERE active=1 ORDER BY sort_order ASC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/clients', async (req, res) => {
  try {
    const { name, logo_url, sort_order = 0, active = 1 } = req.body
    const id = crypto.randomUUID().replace(/-/g, '')
    await query('INSERT INTO wahl_clients (id, name, logo_url, sort_order, active) VALUES (?,?,?,?,?)', [id, name, logo_url, sort_order, active ? 1 : 0])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/admin/install', async (req, res) => {
  try {
    const token = req.headers['x-install-token']
    if (!process.env.INSTALL_TOKEN || token !== process.env.INSTALL_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
    const schema = fs.readFileSync(path.join(process.cwd(), 'server', 'sql', 'schema_basic.sql'), 'utf8')
    const seed = fs.readFileSync(path.join(process.cwd(), 'server', 'sql', 'seed.sql'), 'utf8')
    await query(schema)
    await query(seed)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.delete('/api/clients/:id', async (req, res) => {
  try {
    await query('DELETE FROM wahl_clients WHERE id=?', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const port = process.env.PORT || 3001

// Serve SPA static assets from dist
const distPath = path.join(process.cwd(), 'dist')
app.use(express.static(distPath))
// Serve uploaded assets
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// SPA fallback (keep API routes working)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
// File upload (base64)
app.post('/api/upload', async (req, res) => {
  try {
    const { filename = 'file', contentType = 'application/octet-stream', dataBase64 } = req.body
    if (!dataBase64) return res.status(400).json({ error: 'Missing data' })
    const buf = Buffer.from(dataBase64, 'base64')
    const dir = path.join(process.cwd(), 'uploads')
    await fs.promises.mkdir(dir, { recursive: true })
    const safe = `${Date.now()}-${(filename || 'file').replace(/[^a-zA-Z0-9._-]/g, '')}`
    const full = path.join(dir, safe)
    await fs.promises.writeFile(full, buf)
    res.json({ url: `/uploads/${safe}`, contentType })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
// Auth
app.post('/api/auth/register', authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    const { email, password, full_name, role = 'shipper' } = req.body
    if (!email || !password || !full_name) return res.status(400).json({ error: 'Missing fields' })
    const existing = await query('SELECT id FROM wahl_users WHERE email=?', [email])
    if (existing.length) return res.status(409).json({ error: 'Email already registered' })
    const id = crypto.randomUUID().replace(/-/g, '')
    const hash = await bcrypt.hash(password, 10)
    await query('INSERT INTO wahl_users (id,email,full_name,role,password_hash) VALUES (?,?,?,?,?)', [id, email, full_name, role, hash])
    res.json({ ok: true, user: { id, email, full_name, role } })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, cf_token } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password', code: 'MISSING_FIELDS' })
    const secret = process.env.TURNSTILE_SECRET_KEY || ''
    if (secret) {
      if (!cf_token) return res.status(400).json({ error: 'Verification required' })
      try {
        const params = new URLSearchParams({ secret, response: cf_token, remoteip: req.ip })
        const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        })
        const outcome = await verify.json()
        if (!outcome?.success) return res.status(400).json({ error: 'Verification failed' })
      } catch (err) {
        return res.status(400).json({ error: 'Verification error' })
      }
    }
    const attempts = getAttempts(email, req.ip)
    const tooMany = attempts.length >= MAX_ATTEMPTS
    if (tooMany) {
      const first = attempts[0] || Date.now()
      const retryAfter = Math.max(0, Math.ceil((ATTEMPT_WINDOW_MS - (Date.now() - first)) / 1000))
      console.log(`[auth] lockout active email=${email} ip=${req.ip} retryAfter=${retryAfter}s`)
      return res.status(429).json({ error: 'Login failed. Please try again later.', code: 'LOCKED', retryAfterSeconds: retryAfter })
    }
    const rows = await query('SELECT * FROM wahl_users WHERE email=?', [email])
    if (!rows.length) {
      recordAttempt(email, req.ip)
      console.log(`[auth] failed login: account_not_found email=${email} ip=${req.ip}`)
      return res.status(401).json({ error: "This account does not exist. Please check your credentials or contact support", code: 'ACCOUNT_NOT_FOUND' })
    }
    const user = rows[0]
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      recordAttempt(email, req.ip)
      console.log(`[auth] failed login: incorrect_password email=${email} ip=${req.ip}`)
      return res.status(401).json({ error: "The password you entered is incorrect. Please try again or click 'Forgot Password'", code: 'INCORRECT_PASSWORD' })
    }
    loginAttempts.delete(makeKey(email, req.ip))
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const rows = await query('SELECT id,email,full_name,role FROM wahl_users WHERE id=?', [req.user.id])
    res.json(rows[0] || null)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Carriers
app.get('/api/carriers', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM wahl_carriers WHERE is_active=1 ORDER BY name')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Addresses
app.get('/api/addresses', authMiddleware, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM wahl_addresses WHERE user_id=? ORDER BY created_at DESC', [req.user.id])
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/addresses', authMiddleware, async (req, res) => {
  try {
    const id = crypto.randomUUID().replace(/-/g, '')
    const { label, street, city, state, zip_code, country, is_default } = req.body
    await query('INSERT INTO wahl_addresses (id,user_id,label,street,city,state,zip_code,country,is_default) VALUES (?,?,?,?,?,?,?,?,?)', [id, req.user.id, label, street, city, state || null, zip_code || null, country, is_default ? 1 : 0])
    const rows = await query('SELECT * FROM wahl_addresses WHERE id=?', [id])
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Shipments
app.get('/api/shipments', authMiddleware, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM wahl_shipments WHERE user_id=? ORDER BY created_at DESC', [req.user.id])
    const carriers = await query('SELECT id, name FROM wahl_carriers')
    const carrierMap = Object.fromEntries(carriers.map(c => [c.id, c]))
    const parsed = rows.map(r => ({
      ...r,
      sender_address: typeof r.sender_address === 'string' ? JSON.parse(r.sender_address) : r.sender_address,
      recipient_address: typeof r.recipient_address === 'string' ? JSON.parse(r.recipient_address) : r.recipient_address,
      carrier: r.carrier_id ? carrierMap[r.carrier_id] || null : null,
    }))
    res.json(parsed)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/shipments', authMiddleware, async (req, res) => {
  try {
    const id = crypto.randomUUID().replace(/-/g, '')
    const tracking = (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).toUpperCase()
    const { carrier_id, sender_address, recipient_address, dimensions, service_type, status = 'pending', cost } = req.body
    await query('INSERT INTO wahl_shipments (id,tracking_number,user_id,carrier_id,sender_address,recipient_address,dimensions,service_type,status,cost) VALUES (?,?,?,?,?,?,?,?,?,?)', [id, tracking, req.user.id, carrier_id || null, JSON.stringify(sender_address), JSON.stringify(recipient_address), dimensions || null, service_type, status, cost || null])
    await query('INSERT INTO wahl_tracking_events (id,shipment_id,status,description,location,event_time) VALUES (?,?,?,?,?,?)', [crypto.randomUUID().replace(/-/g, ''), id, 'pending', 'Shipment created and ready for pickup', `${sender_address.city}${sender_address.state ? ', '+sender_address.state : ''}`, new Date()])
    const rows = await query('SELECT * FROM wahl_shipments WHERE id=?', [id])
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/shipments/:id', authMiddleware, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM wahl_shipments WHERE id=? AND user_id=?', [req.params.id, req.user.id])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    const shipmentRaw = rows[0]
    const carrier = shipmentRaw.carrier_id ? (await query('SELECT id, name FROM wahl_carriers WHERE id=?', [shipmentRaw.carrier_id]))[0] || null : null
    const shipment = {
      ...shipmentRaw,
      sender_address: typeof shipmentRaw.sender_address === 'string' ? JSON.parse(shipmentRaw.sender_address) : shipmentRaw.sender_address,
      recipient_address: typeof shipmentRaw.recipient_address === 'string' ? JSON.parse(shipmentRaw.recipient_address) : shipmentRaw.recipient_address,
      carrier,
    }
    const events = await query('SELECT * FROM wahl_tracking_events WHERE shipment_id=? ORDER BY created_at DESC', [req.params.id])
    res.json({ shipment, tracking_events: events })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Tracking by number (public)
app.get('/api/tracking', async (req, res) => {
  try {
    const number = req.query.number
    if (!number) return res.status(400).json({ error: 'Missing number' })
    const rows = await query('SELECT * FROM wahl_shipments WHERE tracking_number=?', [number])
    if (!rows.length) return res.json(null)
    const shipmentRaw = rows[0]
    const carrier = shipmentRaw.carrier_id ? (await query('SELECT id, name FROM wahl_carriers WHERE id=?', [shipmentRaw.carrier_id]))[0] || null : null
    const shipment = {
      ...shipmentRaw,
      sender_address: typeof shipmentRaw.sender_address === 'string' ? JSON.parse(shipmentRaw.sender_address) : shipmentRaw.sender_address,
      recipient_address: typeof shipmentRaw.recipient_address === 'string' ? JSON.parse(shipmentRaw.recipient_address) : shipmentRaw.recipient_address,
      carrier,
    }
    const events = await query('SELECT * FROM wahl_tracking_events WHERE shipment_id=? ORDER BY created_at DESC', [shipment.id])
    res.json({ shipment, tracking_events: events })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
