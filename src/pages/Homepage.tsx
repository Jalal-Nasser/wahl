import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Truck, Clock, Shield, Search, ArrowRight, Star, Users, Globe, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'
import Footer from '@/components/Footer'
import { useTranslation } from 'react-i18next'

export default function Homepage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      navigate(`/tracking?number=${trackingNumber.trim()}`)
    }
  }

  const features = [
    {
      icon: Truck,
      title: t('features.express_shipping'),
      description: t('features.express_shipping_desc')
    },
    {
      icon: Globe,
      title: t('features.international_logistics'),
      description: t('features.international_logistics_desc')
    },
    {
      icon: Shield,
      title: t('features.secure_handling'),
      description: t('features.secure_handling_desc')
    },
    {
      icon: Clock,
      title: t('features.real_time_tracking'),
      description: t('features.real_time_tracking_desc')
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'E-Commerce Plus',
      contentKey: 'homepage.testimonial1',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'Global Trade Co.',
      contentKey: 'homepage.testimonial2',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      company: 'Quick Deliveries',
      contentKey: 'homepage.testimonial3',
      rating: 5
    }
  ]

  const stats = [
    { value: '50K+', label: t('stats.shipments_delivered'), icon: Package },
    { value: '99.5%', label: t('stats.on_time_delivery'), icon: Clock },
    { value: '10K+', label: t('stats.happy_customers'), icon: Users },
    { value: '24/7', label: t('stats.customer_support'), icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSlider />

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-gray-800 text-lg font-semibold mb-4 text-center">{t('track.title')}</h3>
            <form onSubmit={handleTracking} className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder={t('track.placeholder')}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center"
              >
                {t('actions.track')}
                <Search className="ml-2 h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 rtl-ltr">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('homepage.services_title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('homepage.services_sub')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('homepage.testimonials_title')}</h2>
            <p className="text-xl text-gray-600">{t('homepage.testimonials_sub')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{t(testimonial.contentKey)}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('homepage.cta_title')}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{t('homepage.cta_sub')}</p>
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center"
          >
            {t('actions.get_started')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
