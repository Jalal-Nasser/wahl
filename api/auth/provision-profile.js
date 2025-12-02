import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, serviceKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    const { data: authUser } = await supabase.auth.getUser(token)
    if (!authUser?.user) return res.status(401).json({ error: 'Unauthorized' })
    const { email, full_name, role } = req.body || {}
    const userId = authUser.user.id
    const { data: existing } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()
    if (existing) return res.status(200).json(existing)
    const payload = { id: userId, email: email || authUser.user.email || '', full_name: full_name || '', role: role || 'shipper' }
    const { data, error } = await supabase.from('users').insert(payload).select('*').maybeSingle()
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

