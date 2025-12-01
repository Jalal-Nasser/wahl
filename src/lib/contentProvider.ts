import { supabase } from '@/lib/supabase'
import { SiteSettings, HeroSlide, ClientLogo } from '@/types/database'

const provider = import.meta.env.VITE_DATA_PROVIDER || 'supabase'
const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (provider === 'plesk') {
    const res = await fetch(`${apiBase}/site-settings`)
    const data = await res.json()
    return data || null
  }
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
  return (data as SiteSettings[] | null)?.[0] || null
}

export async function upsertSiteSettings(payload: Partial<SiteSettings>): Promise<SiteSettings | null> {
  if (provider === 'plesk') {
    const res = await fetch(`${apiBase}/site-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return data || null
  }
  const { data } = await supabase.from('site_settings').upsert(payload).select('*')
  return (data as SiteSettings[] | null)?.[0] || null
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (provider === 'plesk') {
    const res = await fetch(`${apiBase}/hero-slides`)
    const data = await res.json()
    return data || []
  }
  const { data } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order')
  return (data as HeroSlide[] | null) || []
}

export async function addHeroSlide(payload: Partial<HeroSlide>) {
  if (provider === 'plesk') {
    await fetch(`${apiBase}/hero-slides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return
  }
  await supabase.from('hero_slides').insert({ ...payload, active: true })
}

export async function deleteHeroSlide(id: string) {
  if (provider === 'plesk') {
    await fetch(`${apiBase}/hero-slides/${id}`, { method: 'DELETE' })
    return
  }
  await supabase.from('hero_slides').delete().eq('id', id)
}

export async function getClients(): Promise<ClientLogo[]> {
  if (provider === 'plesk') {
    const res = await fetch(`${apiBase}/clients`)
    const data = await res.json()
    return data || []
  }
  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('active', true)
    .order('sort_order')
  return (data as ClientLogo[] | null) || []
}

export async function addClient(payload: Partial<ClientLogo>) {
  if (provider === 'plesk') {
    await fetch(`${apiBase}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return
  }
  await supabase.from('clients').insert({ ...payload, active: true })
}

export async function deleteClient(id: string) {
  if (provider === 'plesk') {
    await fetch(`${apiBase}/clients/${id}`, { method: 'DELETE' })
    return
  }
  await supabase.from('clients').delete().eq('id', id)
}
