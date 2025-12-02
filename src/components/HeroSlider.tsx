import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { HeroSlide } from '@/types/database'
import { getHeroSlides } from '@/lib/contentProvider'
import { useTranslation } from 'react-i18next'

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [slides, setSlides] = useState<string[]>([])
  const { t } = useTranslation()
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl'

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

  const prev = () => setIndex((index - 1 + slides.length) % slides.length)
  const next = () => setIndex((index + 1) % slides.length)

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[520px] md:h-[680px] rounded-2xl">
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
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">{t('homepage.services_title')}</h1>
              <p className="text-lg md:text-xl text-white/85 mb-8">{t('homepage.services_sub')}</p>
              <div className="flex gap-4">
                <a href="/services" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold">{t('actions.more')}</a>
              </div>
            </div>
          </div>
        </div>

        <button onClick={prev} aria-label="Previous slide" className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full`}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={next} aria-label="Next slide" className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full`}>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border-2 ${i === index ? 'bg-white border-white' : 'border-white/80'}`} />)
          )}
        </div>
      </div>
    </section>
  )
}
