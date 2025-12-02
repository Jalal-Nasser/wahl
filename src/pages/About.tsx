import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Award, Globe, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  const teamMembers = [
    {
      name: t('about.team_member1.name'),
      position: t('about.team_member1.position'),
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20businessman%20CEO%20headshot%2C%20confident%20leadership%20expression%2C%20modern%20suit%2C%20corporate%20portrait%2C%20clean%20background&image_size=square',
      bio: t('about.team_member1.bio')
    },
    {
      name: t('about.team_member2.name'),
      position: t('about.team_member2.position'),
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20businesswoman%20executive%20headshot%2C%20confident%20corporate%20leader%2C%20modern%20business%20attire%2C%20professional%20lighting%2C%20clean%20background&image_size=square',
      bio: t('about.team_member2.bio')
    },
    {
      name: t('about.team_member3.name'),
      position: t('about.team_member3.position'),
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20tech%20executive%20headshot%2C%20innovative%20leader%2C%20modern%20business%20attire%2C%20tech%20industry%20professional%2C%20clean%20background&image_size=square',
      bio: t('about.team_member3.bio')
    },
    {
      name: t('about.team_member4.name'),
      position: t('about.team_member4.position'),
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Hispanic%20woman%20business%20headshot%2C%20warm%20professional%20smile%2C%20corporate%20attire%2C%20customer%20service%20professional%2C%20clean%20background&image_size=square',
      bio: t('about.team_member4.bio')
    }
  ];

  const milestones = [
    { year: '1999', title: t('about.timeline_1999.title'), description: t('about.timeline_1999.description') },
    { year: '2005', title: t('about.timeline_2005.title'), description: t('about.timeline_2005.description') },
    { year: '2012', title: t('about.timeline_2012.title'), description: t('about.timeline_2012.description') },
    { year: '2018', title: t('about.timeline_2018.title'), description: t('about.timeline_2018.description') },
    { year: '2024', title: t('about.timeline_2024.title'), description: t('about.timeline_2024.description') },
  ];
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('about.title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">{t('about.sub')}</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('about.our_story_title')}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.our_story_p1')}
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.our_story_p2')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.our_story_p3')}
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
              <div className="text-blue-200">{t('about.stats_clients')}</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-200">{t('about.stats_awards')}</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Globe className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">{t('about.stats_countries')}</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-blue-200">{t('about.stats_years')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('about.timeline_title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('about.timeline_sub')}</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('about.team_title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('about.team_sub')}</p>
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
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission_title')}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.mission_text')}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{t('about.vision_title')}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.vision_text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
