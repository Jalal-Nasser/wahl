import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { addClient, addHeroSlide, deleteClient, deleteHeroSlide, getClients, getHeroSlides, getSiteSettings, upsertSiteSettings } from '@/lib/contentProvider'
import { SiteSettings, HeroSlide, ClientLogo } from '@/types/database'
import { Plus, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function AdminContent() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [headerBrand, setHeaderBrand] = useState('')
  const [footerBrand, setFooterBrand] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [clients, setClients] = useState<ClientLogo[]>([])
  const [newSlide, setNewSlide] = useState({ image_url: '', title: '', subtitle: '', sort_order: 0 })
  const [newClient, setNewClient] = useState({ name: '', logo_url: '', sort_order: 0 })

  useEffect(() => {
    if (!user) return navigate('/login')
    if (user.role !== 'admin') return navigate('/dashboard')
  }, [user])

  useEffect(() => {
    const load = async () => {
      const current = await getSiteSettings()
      setSettings(current)
      setPhone(current?.phone || '')
      setEmail(current?.email || '')
      setLocation(current?.location || '')
      setLogoUrl(current?.logo_url || '')
      setHeaderBrand(current?.header_brand_text || '')
      setFooterBrand(current?.footer_brand_text || '')
      setFacebook(current?.social_facebook || '')
      setTwitter(current?.social_twitter || '')
      setLinkedin(current?.social_linkedin || '')
      setInstagram(current?.social_instagram || '')

      const hs = await getHeroSlides()
      setSlides((hs as HeroSlide[] | null) || [])

      const cl = await getClients()
      setClients((cl as ClientLogo[] | null) || [])
    }
    load()
  }, [])

  const saveSettings = async () => {
    const payload = {
      id: settings?.id,
      site_name: settings?.site_name || 'WAHL',
      phone,
      email,
      location,
      logo_url: logoUrl,
      header_brand_text: headerBrand,
      footer_brand_text: footerBrand,
      social_facebook: facebook,
      social_twitter: twitter,
      social_linkedin: linkedin,
      social_instagram: instagram,
      updated_at: new Date().toISOString()
    }
    const updated = await upsertSiteSettings(payload)
    setSettings(updated)
  }

  const addSlide = async () => {
    if (!newSlide.image_url) return
    await addHeroSlide({ ...newSlide, active: true })
    setNewSlide({ image_url: '', title: '', subtitle: '', sort_order: 0 })
    const data = await getHeroSlides()
    setSlides((data as HeroSlide[] | null) || [])
  }

  const removeSlide = async (id: string) => {
    await deleteHeroSlide(id)
    const data = await getHeroSlides()
    setSlides((data as HeroSlide[] | null) || [])
  }

  const addClient = async () => {
    if (!newClient.name || !newClient.logo_url) return
    await addClient({ ...newClient, active: true })
    setNewClient({ name: '', logo_url: '', sort_order: 0 })
    const data = await getClients()
    setClients((data as ClientLogo[] | null) || [])
  }

  const removeClient = async (id: string) => {
    await deleteClient(id)
    const data = await getClients()
    setClients((data as ClientLogo[] | null) || [])
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Content Management</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                  <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="https://.../logo.png" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Header Brand Text</label>
                  <input value={headerBrand} onChange={(e) => setHeaderBrand(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="WAHL Logistics وهل اللوجيستية" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Footer Brand Text</label>
                  <input value={footerBrand} onChange={(e) => setFooterBrand(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="WAHL Logistics وهل اللوجيستية" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                    <input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
                    <input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                    <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                    <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                </div>
                <button onClick={saveSettings} className="bg-blue-600 text-white px-4 py-2 rounded-md">Save Settings</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Hero Slides</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {slides.map((s) => (
                    <div key={s.id} className="border rounded-md p-3">
                      <img src={s.image_url} alt={s.title || ''} className="w-full h-32 object-cover rounded" />
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm text-gray-700">{s.title || 'Slide'} • Order {s.sort_order}</div>
                        <button onClick={() => removeSlide(s.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input placeholder="Image URL" value={newSlide.image_url} onChange={(e) => setNewSlide({ ...newSlide, image_url: e.target.value })} className="border rounded-md px-3 py-2" />
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const ab = await file.arrayBuffer()
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(ab)))
                    const resp = await fetch('/api/upload', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ filename: file.name, contentType: file.type, dataBase64: base64 })
                    })
                    const data = await resp.json()
                    if (data?.url) setNewSlide({ ...newSlide, image_url: data.url })
                  }} className="border rounded-md px-3 py-2" />
                  <input placeholder="Title" value={newSlide.title} onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })} className="border rounded-md px-3 py-2" />
                  <input placeholder="Subtitle" value={newSlide.subtitle} onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })} className="border rounded-md px-3 py-2" />
                  <input type="number" placeholder="Order" value={newSlide.sort_order} onChange={(e) => setNewSlide({ ...newSlide, sort_order: parseInt(e.target.value || '0') })} className="border rounded-md px-3 py-2" />
                </div>
                <button onClick={addSlide} className="bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Slide
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Clients</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {clients.map((c) => (
                <div key={c.id} className="border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={c.logo_url} alt={c.name} className="w-16 h-16 object-contain" />
                    <div className="text-sm text-gray-700">{c.name}</div>
                  </div>
                  <button onClick={() => removeClient(c.id)} className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input placeholder="Client Name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="border rounded-md px-3 py-2" />
              <input placeholder="Logo URL" value={newClient.logo_url} onChange={(e) => setNewClient({ ...newClient, logo_url: e.target.value })} className="border rounded-md px-3 py-2" />
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const ab = await file.arrayBuffer()
                const base64 = btoa(String.fromCharCode(...new Uint8Array(ab)))
                const resp = await fetch('/api/upload', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ filename: file.name, contentType: file.type, dataBase64: base64 })
                })
                const data = await resp.json()
                if (data?.url) setNewClient({ ...newClient, logo_url: data.url })
              }} className="border rounded-md px-3 py-2" />
              <input type="number" placeholder="Order" value={newClient.sort_order} onChange={(e) => setNewClient({ ...newClient, sort_order: parseInt(e.target.value || '0') })} className="border rounded-md px-3 py-2" />
            </div>
            <button onClick={addClient} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const ab = await file.arrayBuffer()
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(ab)))
                    const resp = await fetch('/api/upload', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ filename: file.name, contentType: file.type, dataBase64: base64 })
                    })
                    const data = await resp.json()
                    if (data?.url) setLogoUrl(data.url)
                  }} />
                  {logoUrl && (<div className="mt-2 text-xs text-gray-600">Current: {logoUrl}</div>)}
                </div>
