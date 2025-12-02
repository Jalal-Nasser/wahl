import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SiteSettings } from '@/types/database';
import { getSiteSettings } from '@/lib/contentProvider';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  useEffect(() => { (async () => { const s = await getSiteSettings(); setSettings(s) })() }, [])
  const { t, i18n } = useTranslation()
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-2">
                <img src={(settings?.logo_url || '/logo.png')} alt="WAHL" className="h-12 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#111827' }}></div>
                  <span className="absolute text-white font-extrabold text-base">W</span>
                </div>
              </div>
              <div className="text-sm font-bold text-white text-center">{settings?.footer_brand_text || t('brand')}</div>
            </div>
            <p className="text-gray-300 mb-6">
              {t('homepage.cta_sub')}
            </p>
            <div className="flex space-x-4">
              {settings?.social_facebook && (<a href={settings.social_facebook} target="_blank" rel="noreferrer"><Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" /></a>)}
              {settings?.social_twitter && (<a href={settings.social_twitter} target="_blank" rel="noreferrer"><Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" /></a>)}
              {settings?.social_linkedin && (<a href={settings.social_linkedin} target="_blank" rel="noreferrer"><Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" /></a>)}
              {settings?.social_instagram && (<a href={settings.social_instagram} target="_blank" rel="noreferrer"><Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" /></a>)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  {t('nav.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              {t('footer.our_services')}
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  {t('footer.ground_transportation')}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  {t('footer.ocean_freight')}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  {t('footer.air_freight')}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  {t('footer.warehousing')}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  {t('footer.supply_chain')}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              {t('footer.contact_info')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-gray-300">{i18n.language.startsWith('ar') ? 'الدمام' : 'Dammam'}</div>
                  <div className="text-gray-300">{i18n.language.startsWith('ar') ? 'المنطقة الشرقية' : 'Eastern Province'}</div>
                  <div className="text-gray-300">{i18n.language.startsWith('ar') ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 rtl-ltr">+966 12 345 6789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 rtl-ltr">info@wahl.sa</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">{i18n.language.startsWith('ar') ? 'الأحد - الخميس ٨:٠٠ ص إلى ٥:٠٠ م' : 'Sunday-Thursday 8:00 AM to 5:00 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0 rtl-ltr">
              © 2026 WAHL Logistics Solutions. All rights reserved. Designed by{' '}
              <a href="https://github.com/Jalal-Nasser" target="_blank" rel="noreferrer" className="underline hover:text-blue-400">Jalal Nasser</a>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <span className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
                {t('footer.privacy')}
              </span>
              <span className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
                {t('footer.terms')}
              </span>
              <span className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
                {t('footer.cookie')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
