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
  if (!res.ok) throw new Error(await res.text())
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const api = {
  setToken,
  auth: {
    async register(email: string, password: string, full_name: string) {
      const data = await request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, full_name }) })
      if (data?.token) setToken(data.token)
      return data
    },
    async login(email: string, password: string) {
      const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
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
    add(payload: any) { return request('/addresses', { method: 'POST', body: JSON.stringify(payload) }, true) },
  },
  shipments: {
    list() { return request('/shipments', {}, true) },
    create(payload: any) { return request('/shipments', { method: 'POST', body: JSON.stringify(payload) }, true) },
    get(id: string) { return request(`/shipments/${id}`, {}, true) },
    track(number: string) { return request(`/tracking?number=${encodeURIComponent(number)}`) },
  },
}
