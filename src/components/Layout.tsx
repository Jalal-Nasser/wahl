import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { BarChart3, Truck, Search, User, LogOut, Menu, X, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Layout() {
  const { user, logout, checkAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const rtl = document.documentElement.getAttribute('dir') === 'rtl'

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: BarChart3 },
    { name: t('nav.shipments'), href: '/shipments', icon: Truck },
    { name: t('nav.tracking'), href: '/tracking', icon: Search },
    { name: t('nav.analytics'), href: '/analytics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between h-16 ${rtl ? 'flex-row-reverse' : ''}`}>
            <div className={`flex ${rtl ? 'flex-row-reverse' : ''}`}>
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <img src="/logo.png" alt="WAHL" className="h-8 w-8 object-contain" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">{t('brand')}</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className={`hidden sm:flex sm:gap-8 sm:mx-6 ${rtl ? 'flex-row-reverse' : ''}`}>
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        inline-flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium ${rtl ? 'flex-row-reverse' : ''}
                        ${isActive(item.href)
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right side */}
            <div className={`hidden sm:flex sm:items-center sm:gap-4 sm:mx-6 ${rtl ? 'flex-row-reverse' : ''}`}>
              <Link
                to="/shipments/create"
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4" />
                {t('actions.new_shipment')}
              </Link>

              {/* User menu */}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-blue-700">{user?.full_name}</Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
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
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              <Link
                to="/shipments/create"
                className="flex items-center gap-3 px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="h-5 w-5" />
                {t('actions.new_shipment')}
              </Link>
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

      {/* Main content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
