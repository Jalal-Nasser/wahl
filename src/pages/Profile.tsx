import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { useTranslation } from 'react-i18next'

type Theme = 'light' | 'dark' | 'system'

export default function Profile() {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [bio, setBio] = useState('')
  const [theme, setTheme] = useState<Theme>('system')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [notifPush, setNotifPush] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const [imageSrc, setImageSrc] = useState<string>('')
  const [zoom, setZoom] = useState<number>(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.profile.get()
        setBio(data?.bio || '')
        setAvatarUrl(data?.avatar_url || '')
        setTheme((data?.theme as Theme) || 'system')
        setNotifEmail(Boolean(data?.notifications?.email))
        setNotifSms(Boolean(data?.notifications?.sms))
        setNotifPush(Boolean(data?.notifications?.push))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleImage = async (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const renderCrop = async () => {
    if (!imageSrc || !canvasRef.current) return
    const img = new Image()
    img.src = imageSrc
    await img.decode()
    const size = 256
    const ctx = canvasRef.current.getContext('2d')!
    canvasRef.current.width = size
    canvasRef.current.height = size
    const scale = zoom
    const iw = img.width * scale
    const ih = img.height * scale
    const cx = Math.max(0, (iw - size) / 2)
    const cy = Math.max(0, (ih - size) / 2)
    ctx.clearRect(0,0,size,size)
    ctx.drawImage(img, -cx, -cy, iw, ih)
    const blob: Blob = await new Promise((resolve) => canvasRef.current!.toBlob(b => resolve(b!), 'image/png'))
    const ab = await blob.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(ab)))
    const resp = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: `avatar-${Date.now()}.png`, contentType: 'image/png', dataBase64: base64 })
    })
    const data = await resp.json()
    if (data?.url) setAvatarUrl(data.url)
  }

  const save = async () => {
    setSaving(true)
    try {
      await api.profile.update({ full_name: fullName, phone, bio, avatar_url: avatarUrl, theme, notifications: { email: notifEmail, sms: notifSms, push: notifPush } })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold mb-6">{t('nav.dashboard')} • {t('actions.view')}</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full border rounded-md px-3 py-2 h-28" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)} className="w-full border rounded-md px-3 py-2">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} /> Email</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={notifSms} onChange={(e) => setNotifSms(e.target.checked)} /> SMS</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} /> Push</label>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {avatarUrl && <img src={avatarUrl} alt="avatar" className="w-24 h-24 rounded-full object-cover" />}
            <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImage(e.target.files[0])} />
          </div>
          {imageSrc && (
            <div className="space-y-3">
              <div className="w-64 h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
                <img src={imageSrc} style={{ transform: `scale(${zoom})` }} className="object-cover" />
              </div>
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
              <canvas ref={canvasRef} className="hidden" />
              <button onClick={renderCrop} className="px-4 py-2 rounded-md bg-blue-600 text-white">Save Picture</button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <button disabled={saving} onClick={save} className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save Profile'}</button>
        </div>
      </div>
    </div>
  )
}
