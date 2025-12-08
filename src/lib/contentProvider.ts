import { supabase } from '@/lib/supabase'
import { SiteSettings, HeroSlide, ClientLogo, ContentSection } from '@/types/database'

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

// Content Management System (CMS) functions
export async function listSections(): Promise<ContentSection[]> {
  if (provider === 'plesk') {
    const res = await fetch(`${apiBase}/cms/sections`)
    const data = await res.json()
    return data || []
  }
  const { data } = await supabase
    .from('content_sections')
    .select('*')
    .order('updated_at', { ascending: false })
  return (data as ContentSection[] | null) || []
}

export async function getSection(id: string): Promise<ContentSection | null> {
  if (provider === 'plesk') {
    const res = await fetch(`${apiBase}/cms/sections/${id}`)
    const data = await res.json()
    return data || null
  }
  const { data } = await supabase
    .from('content_sections')
    .select('*')
    .eq('id', id)
    .single()
  return (data as ContentSection | null) || null
}

export async function createSection(payload: Partial<ContentSection>): Promise<ContentSection | null> {
  if (provider === 'plesk') {
    const res = await fetch(`${apiBase}/cms/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return data || null
  }
  const { data } = await supabase
    .from('content_sections')
    .insert({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single()
  return (data as ContentSection | null) || null
}

export async function updateSection(id: string, payload: Partial<ContentSection>): Promise<ContentSection | null> {
  if (provider === 'plesk') {
    const res = await fetch(`${apiBase}/cms/sections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return data || null
  }
  const { data } = await supabase
    .from('content_sections')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()
  return (data as ContentSection | null) || null
}

export async function deleteSection(id: string) {
  if (provider === 'plesk') {
    await fetch(`${apiBase}/cms/sections/${id}`, { method: 'DELETE' })
    return
  }
  await supabase.from('content_sections').delete().eq('id', id)
}

export async function publishSchedule(id: string, publishAt: string) {
  if (provider === 'plesk') {
    await fetch(`${apiBase}/cms/sections/${id}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publish_at: publishAt }),
    })
    return
  }
  await supabase
    .from('content_sections')
    .update({
      schedule_at: publishAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
}
