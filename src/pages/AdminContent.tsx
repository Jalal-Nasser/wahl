import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { addClient, addHeroSlide, deleteClient, deleteHeroSlide, getClients, getHeroSlides, getSiteSettings, upsertSiteSettings, listSections, getSection, createSection, updateSection, publishSchedule } from '@/lib/contentProvider'
import { SiteSettings, HeroSlide, ClientLogo, ContentSection } from '@/types/database'
import { Plus, Trash2, Edit, Eye, Calendar, X } from 'lucide-react'
import Editor from '@/components/Editor'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

export default function AdminContent() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
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
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<'shipper' | 'carrier' | 'admin'>('shipper')
  const [inviteMsg, setInviteMsg] = useState<string | null>(null)
  const [sections, setSections] = useState<ContentSection[]>([])
  const [newSection, setNewSection] = useState({ slug: '', title: '', seo_title: '', seo_description: '' })
  const [activeSection, setActiveSection] = useState<ContentSection | null>(null)
  const [editorHtml, setEditorHtml] = useState('')
  const [scheduleAt, setScheduleAt] = useState('')
  const [isLoadingSections, setIsLoadingSections] = useState(false)
  const [sectionsError, setSectionsError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [user, navigate])

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

      setIsLoadingSections(true)
      setSectionsError(null)
      try {
        const s = await listSections()
        setSections(Array.isArray(s) ? (s as ContentSection[]) : [])
        setIsLoadingSections(false)
      } catch (error) {
        setSectionsError((error as Error).message || 'Failed to load pages')
        setIsLoadingSections(false)
      }
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

  const addClientItem = async () => {
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

  const handleCreateSection = async () => {
    if (!newSection.slug || !newSection.title) return
    await createSection({ ...newSection, body_html: '' })
    const list = await listSections()
    setSections(Array.isArray(list) ? (list as ContentSection[]) : [])
    setNewSection({ slug: '', title: '', seo_title: '', seo_description: '' })
  }

  const openSection = async (id: string) => {
    const s = await getSection(id) as ContentSection
    setActiveSection(s)
    setEditorHtml(s?.body_html || '')
    setScheduleAt(s?.schedule_at ? String(s.schedule_at).slice(0,16) : '')
  }

  const saveSection = async () => {
    if (!activeSection) return
    await updateSection(activeSection.id, { title: activeSection.title, seo_title: activeSection.seo_title, seo_description: activeSection.seo_description, body_html: editorHtml })
    const list = await listSections()
    setSections(Array.isArray(list) ? (list as ContentSection[]) : [])
  }

  const handleSchedulePublish = async () => {
    if (!activeSection || !scheduleAt) return
    await publishSchedule(activeSection.id, new Date(scheduleAt).toISOString())
  }

  const sendInvite = async () => {
    setInviteMsg(null)
    if (!inviteEmail || !inviteName) { setInviteMsg(t('admin_panel.invitation_fields_required')); return }
    try {
      const res = await api.admin.invite(inviteEmail, inviteName, inviteRole)
      if (res?.ok) {
        setInviteMsg(t('admin_panel.invitation_sent'))
        setInviteEmail(''); setInviteName(''); setInviteRole('shipper')
      } else {
        setInviteMsg(t('admin_panel.invitation_failed'))
      }
    } catch (e) {
      setInviteMsg((e as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">{t('admin_panel.page_title')}</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">{t('admin_panel.site_settings')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('admin_panel.phone')}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('admin_panel.email')}</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('admin_panel.location')}</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('admin_panel.logo_url')}</label>
                  <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="https://.../logo.png" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('admin_panel.header_brand_text')}</label>
                  <input value={headerBrand} onChange={(e) => setHeaderBrand(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="WAHL Logistics وهل اللوجيستية" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('admin_panel.footer_brand_text')}</label>
                  <input value={footerBrand} onChange={(e) => setFooterBrand(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="WAHL Logistics وهل اللوجيستية" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('admin_panel.facebook_url')}</label>
                    <input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('admin_panel.twitter_url')}</label>
                    <input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('admin_panel.linkedin_url')}</label>
                    <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('admin_panel.instagram_url')}</label>
                    <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                </div>
                <button onClick={saveSettings} className="bg-blue-600 text-white px-4 py-2 rounded-md">{t('admin_panel.save_settings')}</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">{t('admin_panel.hero_slides')}</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {slides.map((s) => (
                    <div key={s.id} className="border rounded-md p-3">
                      <img src={s.image_url} alt={s.title || ''} className="w-full h-32 object-cover rounded" />
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm text-gray-700">{s.title || t('admin_panel.slide')} • {t('admin_panel.order')} {s.sort_order}</div>
                        <button onClick={() => removeSlide(s.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input placeholder={t('admin_panel.image_url')} value={newSlide.image_url} onChange={(e) => setNewSlide({ ...newSlide, image_url: e.target.value })} className="border rounded-md px-3 py-2" />
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
                  <input placeholder={t('admin_panel.slide_title')} value={newSlide.title} onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })} className="border rounded-md px-3 py-2" />
                  <input placeholder={t('admin_panel.subtitle')} value={newSlide.subtitle} onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })} className="border rounded-md px-3 py-2" />
                  <input type="number" placeholder={t('admin_panel.order')} value={newSlide.sort_order} onChange={(e) => setNewSlide({ ...newSlide, sort_order: parseInt(e.target.value || '0') })} className="border rounded-md px-3 py-2" />
                </div>
                <button onClick={addSlide} className="bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {t('admin_panel.add_slide')}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">{t('admin_panel.user_invitations')}</h2>
            {inviteMsg && (
              <div className="mb-4 p-3 rounded-md border text-sm ${inviteMsg.includes('success') ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}">
                {inviteMsg}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input placeholder={t('admin_panel.user_email')} value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="border rounded-md px-3 py-2" />
              <input placeholder={t('admin_panel.full_name')} value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="border rounded-md px-3 py-2" />
              <select value={inviteRole} onChange={(e) => { const v = e.target.value; if (v === 'shipper' || v === 'carrier' || v === 'admin') setInviteRole(v); }} className="border rounded-md px-3 py-2">
                <option value="shipper">{t('admin_panel.role_shipper')}</option>
                <option value="carrier">{t('admin_panel.role_carrier')}</option>
                <option value="admin">{t('admin_panel.role_admin')}</option>
              </select>
              <button onClick={sendInvite} className="bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('admin_panel.send_invite')}
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">{t('admin_panel.clients')}</h2>
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
              <input placeholder={t('admin_panel.client_name')} value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="border rounded-md px-3 py-2" />
              <input placeholder={t('admin_panel.image_url')} value={newClient.logo_url} onChange={(e) => setNewClient({ ...newClient, logo_url: e.target.value })} className="border rounded-md px-3 py-2" />
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
              <input type="number" placeholder={t('admin_panel.order')} value={newClient.sort_order} onChange={(e) => setNewClient({ ...newClient, sort_order: parseInt(e.target.value || '0') })} className="border rounded-md px-3 py-2" />
            </div>
            <button onClick={addClientItem} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('admin_panel.add_client')}
            </button>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{t('admin_panel.pages')}</h2>
              <button onClick={() => setNewSection({ slug: 'new-page', title: '', seo_title: '', seo_description: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                {t('admin_panel.create_page')}
              </button>
            </div>

            {/* Create New Page Form */}
            {newSection.slug || newSection.title ? (
              <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 text-blue-900">{t('admin_panel.create_page')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input placeholder={t('admin_panel.slug')} value={newSection.slug} onChange={(e) => setNewSection({ ...newSection, slug: e.target.value })} className="border rounded-md px-3 py-2 w-full" />
                  <input placeholder={t('admin_panel.page_title_field')} value={newSection.title} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} className="border rounded-md px-3 py-2 w-full" />
                  <input placeholder={t('admin_panel.seo_title')} value={newSection.seo_title} onChange={(e) => setNewSection({ ...newSection, seo_title: e.target.value })} className="border rounded-md px-3 py-2 w-full" />
                  <input placeholder={t('admin_panel.seo_description')} value={newSection.seo_description} onChange={(e) => setNewSection({ ...newSection, seo_description: e.target.value })} className="border rounded-md px-3 py-2 w-full" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCreateSection} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">{t('admin_panel.create')}</button>
                  <button onClick={() => setNewSection({ slug: '', title: '', seo_title: '', seo_description: '' })} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">{t('admin_panel.cancel')}</button>
                </div>
              </div>
            ) : null}

            {/* Loading State */}
            {isLoadingSections && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">{t('admin_panel.loading_pages')}</p>
              </div>
            )}

            {/* Error State */}
            {sectionsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-700">{t('admin_panel.error_loading_pages')}: {sectionsError}</p>
              </div>
            )}

            {/* Pages Table */}
            {!isLoadingSections && !sectionsError && (
              <>
                {sections.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-2">{t('admin_panel.no_pages_yet')}</p>
                    <p className="text-sm text-gray-400">{t('admin_panel.no_pages_hint')}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_panel.table_title')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_panel.table_slug')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_panel.table_status')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_panel.table_updated')}</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_panel.table_actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sections.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{s.title}</div>
                              {s.seo_title && <div className="text-xs text-gray-500">{s.seo_title}</div>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <code className="text-sm text-blue-600">/{s.slug}</code>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {s.published_at ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Eye className="w-3 h-3 mr-1" />
                                  {t('admin_panel.status_published')}
                                </span>
                              ) : s.schedule_at ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {t('admin_panel.status_scheduled')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {t('admin_panel.status_draft')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(s.updated_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => openSection(s.id)} className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1">
                                <Edit className="w-4 h-4" />
                                {t('admin_panel.edit')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Page Editor Modal/Section */}
            {activeSection && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{t('admin_panel.edit_page')}: {activeSection.title}</h3>
                    <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_panel.page_title_field')}</label>
                      <input value={activeSection.title} onChange={(e) => setActiveSection({ ...activeSection, title: e.target.value })} className="border rounded-md px-3 py-2 w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_panel.seo_title')}</label>
                      <input placeholder={t('admin_panel.seo_title')} value={activeSection.seo_title || ''} onChange={(e) => setActiveSection({ ...activeSection, seo_title: e.target.value })} className="border rounded-md px-3 py-2 w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_panel.seo_description')}</label>
                      <input placeholder={t('admin_panel.seo_description')} value={activeSection.seo_description || ''} onChange={(e) => setActiveSection({ ...activeSection, seo_description: e.target.value })} className="border rounded-md px-3 py-2 w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_panel.content')}</label>
                      <Editor value={editorHtml} onChange={setEditorHtml} />
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="border rounded-md px-3 py-2" />
                      <button onClick={handleSchedulePublish} className="px-4 py-2 rounded-md border hover:bg-gray-50">{t('admin_panel.schedule_publish')}</button>
                      <button onClick={saveSection} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">{t('admin_panel.save')}</button>
                      <button onClick={() => setActiveSection(null)} className="px-4 py-2 rounded-md border hover:bg-gray-50 ml-auto">{t('admin_panel.close')}</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
