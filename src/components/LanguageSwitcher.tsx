import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('i18nextLng')) || ''
    const lng = saved || i18n.language
    if (lng && lng !== i18n.language) i18n.changeLanguage(lng)
  }, [i18n])

  const current = i18n.language.startsWith('ar') ? 'ar' : 'en'

  const toggle = () => {
    const next = current === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(next)
    try { localStorage.setItem('i18nextLng', next) } catch { void 0 }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={current === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-label={current === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      className="inline-flex items-center px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm rtl-ltr"
    >
      <span className={current === 'en' ? 'text-blue-700 font-semibold' : 'text-gray-700'}>E</span>
      <span className="mx-1 text-gray-500">|</span>
      <span className={current === 'ar' ? 'text-blue-700 font-semibold' : 'text-gray-700'}>ع</span>
    </button>
  )
}
