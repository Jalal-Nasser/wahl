import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import { SiteSettings } from '@/types/database';
import { getSiteSettings } from '@/lib/contentProvider';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => { (async () => { const s = await getSiteSettings(); setSettings(s) })() }, [])
  const rtl = document.documentElement.getAttribute('dir') === 'rtl'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('contact.title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">{t('contact.sub')}</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contact.phone')}</h3>
              <p className="text-gray-600 mb-2 rtl-ltr">{settings?.phone || '+966 12 345 6789'}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contact.email')}</h3>
              <p className="text-gray-600 rtl-ltr">{settings?.email || 'info@wahl.sa'}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contact.hours')}</h3>
              <p className="text-gray-600">{t('topbar.hours')}</p>
            </div>
          </div>

          {/* Office Locations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.head_office')}</h3>
              <div className="flex items-start space-x-4 mb-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">{i18n.language.startsWith('ar') ? 'الدمام' : 'Dammam'}</p>
                  <p className="text-gray-600">{i18n.language.startsWith('ar') ? 'المنطقة الشرقية' : 'Eastern Province'}</p>
                  <p className="text-gray-600">{i18n.language.startsWith('ar') ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <span className="text-gray-500">{t('contact.map_placeholder')}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.regional_office')}</h3>
              <div className="flex items-start space-x-4 mb-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">{i18n.language.startsWith('ar') ? 'الدمام' : 'Dammam'}</p>
                  <p className="text-gray-600">{i18n.language.startsWith('ar') ? 'المنطقة الشرقية' : 'Eastern Province'}</p>
                  <p className="text-gray-600">{i18n.language.startsWith('ar') ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <span className="text-gray-500">{t('contact.map_placeholder')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('contact.send_us_message')}</h2>
              <p className="text-xl text-gray-600">{t('contact.form_intro')}</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      {t('contact.form_full_name')} *
                    </label>
                    <div className="relative">
                      <User className={`absolute ${rtl ? 'right-3' : 'left-3'} top-3 h-5 w-5 text-gray-400`} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full ${rtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder={t('contact.form_full_name')}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      {t('contact.form_email')} *
                    </label>
                    <div className="relative">
                      <Mail className={`absolute ${rtl ? 'right-3' : 'left-3'} top-3 h-5 w-5 text-gray-400`} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full ${rtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent rtl-ltr`}
                        placeholder={t('contact.form_email')}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      {t('contact.form_phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent rtl-ltr"
                      placeholder={t('contact.form_phone')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      {t('contact.form_subject')} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{t('contact.subject_select')}</option>
                      <option value="quote">{t('contact.subject_quote')}</option>
                      <option value="support">{t('contact.subject_support')}</option>
                      <option value="partnership">{t('contact.subject_partnership')}</option>
                      <option value="careers">{t('contact.subject_careers')}</option>
                      <option value="other">{t('contact.subject_other')}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      {t('contact.form_message')} *
                    </label>
                  <div className="relative">
                    <MessageSquare className={`absolute ${rtl ? 'right-3' : 'left-3'} top-3 h-5 w-5 text-gray-400`} />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full ${rtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                      placeholder={t('contact.form_message')}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <Send className="h-5 w-5" />
                    <span>{t('contact.form_submit')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
