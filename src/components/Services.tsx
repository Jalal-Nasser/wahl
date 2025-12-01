import { Truck, Ship, Plane, Package, Warehouse, Globe } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Ground Transportation',
    description: 'Reliable and efficient ground transportation services for all your logistics needs across the country.',
    features: ['Express Delivery', 'Temperature Controlled', 'Real-time Tracking']
  },
  {
    icon: Ship,
    title: 'Ocean Freight',
    description: 'Comprehensive ocean freight services for international shipping with competitive rates and reliable schedules.',
    features: ['FCL & LCL Services', 'Port-to-Port', 'Customs Clearance']
  },
  {
    icon: Plane,
    title: 'Air Freight',
    description: 'Fast and secure air freight services for time-sensitive shipments with global reach and reliability.',
    features: ['Express Services', 'Door-to-Door', 'Priority Handling']
  },
  {
    icon: Package,
    title: 'Package Delivery',
    description: 'Professional package delivery services with careful handling and timely delivery to your doorstep.',
    features: ['Same Day Delivery', 'Signature Required', 'Insurance Available']
  },
  {
    icon: Warehouse,
    title: 'Warehousing',
    description: 'State-of-the-art warehousing facilities with advanced inventory management and security systems.',
    features: ['Climate Controlled', '24/7 Security', 'Inventory Management']
  },
  {
    icon: Globe,
    title: 'Supply Chain',
    description: 'End-to-end supply chain solutions that optimize your logistics operations and reduce costs.',
    features: ['End-to-End Solutions', 'Cost Optimization', 'Risk Management']
  }
];

export default function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Logistics Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive logistics solutions tailored to meet your business needs. 
            From transportation to warehousing, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200">
                    Learn More →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
}