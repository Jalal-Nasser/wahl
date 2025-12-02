import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}
const supabase = createClient(supabaseUrl || '', serviceKey || '')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    const { data: authUser } = await supabase.auth.getUser(token)
    if (!authUser?.user) return res.status(401).json({ error: 'Unauthorized' })
    const adminId = authUser.user.id
    const { data: profile } = await supabase.from('users').select('role').eq('id', adminId).maybeSingle()
    if (!profile || profile.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })

    const { email, full_name, role = 'shipper' } = req.body || {}
    if (!email || !full_name) return res.status(400).json({ error: 'Missing fields' })

    const { error: inviteErr, data: invited } = await supabase.auth.admin.inviteUserByEmail(email, { data: { full_name, role } })
    if (inviteErr) return res.status(400).json({ error: inviteErr.message })
    return res.status(200).json({ ok: true, id: invited?.user?.id || null })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

