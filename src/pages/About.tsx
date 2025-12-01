import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Award, Globe, Clock } from 'lucide-react';

const teamMembers = [
  {
    name: "John Smith",
    position: "CEO & Founder",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20businessman%20CEO%20headshot%2C%20confident%20leadership%20expression%2C%20modern%20suit%2C%20corporate%20portrait%2C%20clean%20background&image_size=square",
    bio: "With over 25 years in logistics, John founded Logico with a vision to revolutionize supply chain management."
  },
  {
    name: "Sarah Johnson",
    position: "Operations Director",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20businesswoman%20executive%20headshot%2C%20confident%20corporate%20leader%2C%20modern%20business%20attire%2C%20professional%20lighting%2C%20clean%20background&image_size=square",
    bio: "Sarah brings extensive experience in global logistics operations and supply chain optimization."
  },
  {
    name: "Michael Chen",
    position: "Technology Director",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20tech%20executive%20headshot%2C%20innovative%20leader%2C%20modern%20business%20attire%2C%20tech%20industry%20professional%2C%20clean%20background&image_size=square",
    bio: "Michael leads our digital transformation initiatives, implementing cutting-edge logistics technology."
  },
  {
    name: "Emily Rodriguez",
    position: "Customer Relations Manager",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Hispanic%20woman%20business%20headshot%2C%20warm%20professional%20smile%2C%20corporate%20attire%2C%20customer%20service%20professional%2C%20clean%20background&image_size=square",
    bio: "Emily ensures exceptional customer experience and builds lasting relationships with our clients."
  }
];

const milestones = [
  {
    year: "1999",
    title: "Company Founded",
    description: "Logico was established with a mission to provide reliable logistics solutions."
  },
  {
    year: "2005",
    title: "Global Expansion",
    description: "Opened international offices and established global shipping partnerships."
  },
  {
    year: "2012",
    title: "Technology Innovation",
    description: "Launched proprietary tracking system and digital logistics platform."
  },
  {
    year: "2018",
    title: "Industry Leadership",
    description: "Recognized as industry leader with multiple awards for excellence."
  },
  {
    year: "2024",
    title: "Sustainability Focus",
    description: "Implemented green logistics initiatives and carbon-neutral shipping options."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            About WAHL
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Leading the logistics industry with innovation, reliability, and exceptional service. 
            Discover our story and commitment to excellence.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 1999, WAHL has grown from a small local logistics company to a global leader 
                in supply chain management. Our journey has been marked by continuous innovation, 
                unwavering commitment to customer satisfaction, and a passion for excellence.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Today, we serve thousands of clients worldwide, managing complex logistics operations 
                with precision and reliability. Our team of experienced professionals works tirelessly 
                to ensure your cargo reaches its destination safely and on time.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe in building long-lasting partnerships with our clients, understanding their 
                unique needs, and delivering customized solutions that drive their business forward.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20logistics%20company%20headquarters%20building%2C%20professional%20corporate%20office%2C%20clean%20modern%20architecture%2C%20business%20district%20setting%2C%20professional%20lighting&image_size=landscape_4_3"
                alt="WAHL Headquarters"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Happy Clients</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-200">Industry Awards</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Globe className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Countries Served</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-blue-200">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that shaped our company and established us as industry leaders.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to delivering exceptional logistics solutions 
              and driving our company's continued success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To provide innovative, reliable, and efficient logistics solutions that empower 
                businesses to succeed in the global marketplace. We are committed to excellence 
                in every aspect of our service, from initial consultation to final delivery.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Our Vision
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the world's most trusted logistics partner, setting the standard for 
                innovation, reliability, and customer satisfaction in the supply chain industry. 
                We strive to create lasting value for our clients, employees, and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
