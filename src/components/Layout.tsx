import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { BarChart3, Truck, Search, LogOut, Menu, X, Home, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { getGravatarUrl } from '@/lib/gravatar'

export default function Layout() {
  const { user, logout, checkAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const [rtl, setRtl] = useState(() => {
    const lngDir = i18n.dir(i18n.language || i18n.resolvedLanguage)
    const domDir = typeof document !== 'undefined' ? document.documentElement.getAttribute('dir') : null
    return (domDir || lngDir) === 'rtl'
  })

  useEffect(() => {
    const dir = i18n.dir(i18n.language || i18n.resolvedLanguage)
    setRtl(dir === 'rtl')
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', dir)
    }
  }, [i18n, i18n.language])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const [now, setNow] = useState<Date>(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const formatNow = () => {
    const tz = 'Asia/Riyadh'
    const y = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: tz }).format(now)
    const m = new Intl.DateTimeFormat('en-US', { month: '2-digit', timeZone: tz }).format(now)
    const d = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: tz }).format(now)
    const h = new Intl.DateTimeFormat('en-US', { hour: '2-digit', hour12: false, timeZone: tz }).format(now)
    const min = new Intl.DateTimeFormat('en-US', { minute: '2-digit', timeZone: tz }).format(now)
    const s = new Intl.DateTimeFormat('en-US', { second: '2-digit', timeZone: tz }).format(now)
    return `${y}-${m}-${d} ${h}:${min}:${s} (UTC+3)`
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: BarChart3 },
    { name: t('nav.shipments'), href: '/shipments', icon: Truck },
    { name: t('nav.tracking'), href: '/tracking', icon: Search },
    { name: t('nav.analytics'), href: '/analytics', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ name: t('nav.admin'), href: '/admin/content', icon: Settings }] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className={`bg-white shadow-sm border-b border-gray-200 ${rtl ? 'md:mr-72' : 'md:ml-72'} z-30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between h-16`}>
          <div className={`flex pl-6 sm:pl-8 items-center`}>
              <span dir="ltr" className="whitespace-nowrap text-sm text-gray-600">
                {formatNow()}
              </span>
            </div>

            {/* Right side */}
            <div className={`hidden sm:flex sm:items-center sm:gap-4 sm:mx-6`}>
              <Link
                to="/"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-700"
                title={t('nav.home')}
                aria-label={t('nav.home')}
              >
                <Home className="h-4 w-4" />
              </Link>
              <LanguageSwitcher />
              

              {/* User menu */}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <img
                    src={getGravatarUrl(user?.email || '', 80)}
                    alt={user?.full_name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  />
                  <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-blue-700">{user?.full_name}</Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center gap-2">
              <Link
                to="/"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title={t('nav.home')}
                aria-label={t('nav.home')}
              >
                <Home className="h-6 w-6" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-2 text-base font-medium ${rtl ? 'flex-row-reverse' : ''}
                      ${isActive(item.href)
                        ? `${rtl ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'}`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {rtl ? (
                      <>
                        <span>{item.name}</span>
                        <Icon className="h-5 w-5" />
                      </>
                    ) : (
                      <>
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </>
                    )}
                  </Link>
                )
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                {t('actions.logout')}
              </button>
              <div className="px-4 pb-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar */}
      <aside
        className={`hidden md:flex fixed ${rtl ? 'right-0' : 'left-0'} top-0 bottom-0 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-40`}
      >
        <div className="flex flex-col h-full w-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-center border-b border-slate-700/50">
            <div className="bg-white/95 p-3 rounded-xl shadow-lg backdrop-blur-sm">
              <img src="/logo.png" alt="WAHL" className="w-full h-auto max-w-[160px] object-contain mx-auto" />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group relative flex items-center gap-4 px-4 py-3.5 rounded-xl
                      text-base font-medium transition-all duration-300 ease-in-out
                      ${active
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                        : 'text-gray-300 hover:bg-slate-800/50 hover:text-white hover:scale-105'
                      }
                      ${rtl ? 'flex-row-reverse text-right' : 'text-left'}
                    `}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className={`absolute ${rtl ? 'right-0 rounded-r-xl' : 'left-0 rounded-l-xl'} top-0 bottom-0 w-1 bg-white shadow-lg`} />
                    )}

                    {/* Icon with animated background */}
                    <div className={`
                      relative flex items-center justify-center w-10 h-10 rounded-lg
                      transition-all duration-300
                      ${active
                        ? 'bg-white/20 shadow-inner'
                        : 'bg-slate-700/50 group-hover:bg-blue-500/20'
                      }
                    `}>
                      <Icon className={`h-5 w-5 transition-transform duration-300 ${active ? '' : 'group-hover:scale-110'}`} />
                    </div>

                    {/* Text */}
                    <span className="flex-1 font-semibold tracking-wide">
                      {item.name}
                    </span>

                    {/* Hover Arrow Indicator */}
                    {!active && (
                      <div className={`
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        ${rtl ? 'rotate-180' : ''}
                      `}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Bottom Decoration */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`py-6 ${rtl ? 'md:mr-72' : 'md:ml-72'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
