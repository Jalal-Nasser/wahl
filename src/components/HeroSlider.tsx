import { useEffect, useState } from 'react'
import { HeroSlide } from '@/types/database'
import { getHeroSlides } from '@/lib/contentProvider'
import { useTranslation } from 'react-i18next'

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [slides, setSlides] = useState<string[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const loadSlides = async () => {
      const data = await getHeroSlides()
      const urls = (data as HeroSlide[] | null)?.map((s) => s.image_url) || []
      if (urls.length === 0) {
        setSlides([
          'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Cargo%20container%20ship%20at%20sea%2C%20sunset%20lighting%2C%20stacked%20containers&image_size=landscape_16_9',
          'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Port%20cranes%20loading%20containers%2C%20industrial%20logistics%20blue%20hour&image_size=landscape_16_9'
        ])
      } else {
        setSlides(urls)
      }
    }
    loadSlides()
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [slides])

  

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[320px] sm:h-[460px] md:h-[680px] rounded-2xl">
        {slides.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url('${src}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/20 rounded-2xl" />

        <div className="absolute inset-0 z-10 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4 sm:mb-6">{t('homepage.services_title')}</h1>
              <p className="text-base sm:text-lg md:text-xl text-white/85 mb-6 sm:mb-8">{t('homepage.services_sub')}</p>
              <div className="flex gap-3 sm:gap-4">
                <a href="/services" className="bg-white text-gray-900 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold">{t('actions.more')}</a>
              </div>
            </div>
          </div>
        </div>

        

        
      </div>
    </section>
  )
}
