import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const supportedLngs = ['en', 'ar'] as const

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs,
    debug: false,
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false
    }
  })

// Ensure document attributes reflect selected language and direction
function applyDirAndLang(lng: string) {
  const dir = i18n.dir(lng)
  document.documentElement.setAttribute('lang', lng)
  document.documentElement.setAttribute('dir', dir)
}

applyDirAndLang(i18n.resolvedLanguage || i18n.language)

i18n.on('languageChanged', (lng) => applyDirAndLang(lng))

export default i18n
