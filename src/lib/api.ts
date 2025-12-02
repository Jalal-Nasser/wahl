const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

function getToken() {
  return localStorage.getItem('wahl_token') || ''
}

function setToken(t: string) {
  localStorage.setItem('wahl_token', t)
}

async function request(path: string, options: RequestInit = {}, auth = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const ct = res.headers.get('content-type') || ''
  if (!res.ok) {
    if (ct.includes('application/json')) {
      const data = await res.json()
      const err = new Error(typeof data?.error === 'string' ? data.error : 'Request failed') as Error & { code?: string }
      if (data?.code) err.code = data.code
      throw err
    }
    throw new Error(await res.text())
  }
  return ct.includes('application/json') ? res.json() : res.text()
}

export const api = {
  setToken,
  admin: {
    async invite(email: string, full_name: string, role: string) {
      const { data } = await supabase.auth.getSession()
      const access = data.session?.access_token || ''
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (access) headers['Authorization'] = `Bearer ${access}`
      return request('/admin/invite', { method: 'POST', headers, body: JSON.stringify({ email, full_name, role }) })
    }
  },
  profiles: {
    async provision(email: string, full_name: string, role: string) {
      const { data } = await supabase.auth.getSession()
      const access = data.session?.access_token || ''
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (access) headers['Authorization'] = `Bearer ${access}`
      return request('/auth/provision-profile', { method: 'POST', headers, body: JSON.stringify({ email, full_name, role }) })
    }
  },
  auth: {
    async register(email: string, password: string, full_name: string) {
      const data = await request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, full_name }) })
      if (data?.token) setToken(data.token)
      return data
    },
    async login(email: string, password: string, cf_token?: string) {
      const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, cf_token }) })
      if (data?.token) setToken(data.token)
      return data
    },
    async me() {
      return request('/auth/me', {}, true)
    },
    logout() { localStorage.removeItem('wahl_token') },
  },
  carriers: {
    list() { return request('/carriers') },
  },
  addresses: {
    list() { return request('/addresses', {}, true) },
    add(payload: Record<string, unknown>) { return request('/addresses', { method: 'POST', body: JSON.stringify(payload) }, true) },
  },
  shipments: {
    list() { return request('/shipments', {}, true) },
    create(payload: Record<string, unknown>) { return request('/shipments', { method: 'POST', body: JSON.stringify(payload) }, true) },
    get(id: string) { return request(`/shipments/${id}`, {}, true) },
    track(number: string) { return request(`/tracking?number=${encodeURIComponent(number)}`) },
  },
}
import { supabase } from '@/lib/supabase'
