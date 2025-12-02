import { useEffect, useState } from 'react';
import { Menu, X, Mail, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '@/types/database';
import { getSiteSettings } from '@/lib/contentProvider';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.clients'), href: '/clients' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const s = await getSiteSettings()
      setSettings(s)
    }
    loadSettings()
  }, [])

  const [now, setNow] = useState<Date>(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const formatNow = () => {
    const locale = i18n.language.startsWith('ar') ? 'ar-SA' : 'en-US'
    const tz = 'Asia/Riyadh'
    const day = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: tz }).format(now)
    const date = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: tz }).format(now)
    const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: tz }).format(now)
    return `${day} ${date} ${time} (UTC+3)`
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className={`flex flex-col sm:flex-row ${document.documentElement.getAttribute('dir') === 'rtl' ? 'sm:flex-row-reverse' : ''} sm:justify-between sm:items-center text-xs sm:text-sm`}>
            <div className={`flex flex-wrap items-center gap-3 sm:gap-6 ${document.documentElement.getAttribute('dir') === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${document.documentElement.getAttribute('dir') === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {settings?.social_twitter ? (
                  <a href={settings.social_twitter} target="_blank" rel="noreferrer" className="text-white hover:text-blue-300">
                    <Twitter className="h-4 w-4" />
                  </a>
                ) : (
                  <Twitter className="h-4 w-4" />
                )}
                {settings?.social_linkedin ? (
                  <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="text-white hover:text-blue-300">
                    <Linkedin className="h-4 w-4" />
                  </a>
                ) : (
                  <Linkedin className="h-4 w-4" />
                )}
                {settings?.social_facebook ? (
                  <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="text-white hover:text-blue-300">
                    <Facebook className="h-4 w-4" />
                  </a>
                ) : (
                  <Facebook className="h-4 w-4" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="rtl-ltr whitespace-nowrap truncate max-w-[140px] sm:max-w-none">{settings?.email || 'info@wahl.sa'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="whitespace-nowrap">{settings?.location ? settings.location : (i18n.language.startsWith('ar') ? 'الدمام, المملكة العربية السعودية' : 'Dammam, Saudi Arabia')}</span>
              </div>
            </div>
            <div className="hidden sm:flex gap-4 mt-2 sm:mt-0">
              <span className="rtl-ltr whitespace-nowrap">{formatNow()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={settings?.logo_url || '/logo.png'} alt={t('brand')} className="h-10 w-auto" />
            <span className="font-bold text-[#1e3a8a] text-[17px] tracking-[0.2px]">{settings?.header_brand_text || t('brand')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-sm font-medium"
            >
              {t('auth.sign_in')}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-blue-900 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-2 px-4">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
