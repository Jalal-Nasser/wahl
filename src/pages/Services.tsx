import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Truck, Ship, Plane, Package, Warehouse, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Services() {
  const { t } = useTranslation();
  const services = [
    {
      icon: Truck,
      title: t('services_page.ground_title'),
      description: t('services_page.ground_desc'),
      features: t('services_page.ground_features', { returnObjects: true }) as string[],
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20logistics%20truck%20on%20highway%2C%20professional%20transportation%20vehicle%2C%20clean%20background%2C%20commercial%20vehicle&image_size=landscape_4_3"
    },
    {
      icon: Ship,
      title: t('services_page.ocean_title'),
      description: t('services_page.ocean_desc'),
      features: t('services_page.ocean_features', { returnObjects: true }) as string[],
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Cargo%20ship%20at%20sea%2C%20container%20vessel%2C%20blue%20ocean%20water%2C%20commercial%20shipping%2C%20professional%20maritime%20transport&image_size=landscape_4_3"
    },
    {
      icon: Plane,
      title: t('services_page.air_title'),
      description: t('services_page.air_desc'),
      features: t('services_page.air_features', { returnObjects: true }) as string[],
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Cargo%20airplane%20in%20flight%2C%20freight%20aircraft%2C%20blue%20sky%2C%20commercial%20aviation%2C%20professional%20air%20transport&image_size=landscape_4_3"
    },
    {
      icon: Package,
      title: t('services_page.package_title'),
      description: t('services_page.package_desc'),
      features: t('services_page.package_features', { returnObjects: true }) as string[],
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Delivery%20packages%20and%20parcels%2C%20cardboard%20boxes%2C%20professional%20delivery%20setup%2C%20clean%20background%2C%20logistics%20packaging&image_size=landscape_4_3"
    },
    {
      icon: Warehouse,
      title: t('services_page.ware_title'),
      description: t('services_page.ware_desc'),
      features: t('services_page.ware_features', { returnObjects: true }) as string[],
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20warehouse%20facility%2C%20storage%20shelves%2C%20logistics%20center%2C%20professional%20industrial%20building%2C%20clean%20organized%20space&image_size=landscape_4_3"
    },
    {
      icon: Globe,
      title: t('services_page.scm_title'),
      description: t('services_page.scm_desc'),
      features: t('services_page.scm_features', { returnObjects: true }) as string[],
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Global%20supply%20chain%20network%2C%20worldwide%20logistics%20connections%2C%20professional%20business%20network%2C%20international%20trade%20routes%2C%20clean%20modern%20design&image_size=landscape_4_3"
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('services_page.title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">{t('services_page.sub')}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative h-64 bg-gray-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 left-6">
                      <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('services_page.cta_title')}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">{t('services_page.cta_sub')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-200">
              {t('services_page.cta_quote')}
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
              {t('services_page.cta_contact')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
