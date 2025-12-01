import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ClientLogo } from '@/types/database'
import { getClients } from '@/lib/contentProvider'

export default function Clients() {
  const [clients, setClients] = useState<ClientLogo[]>([])

  useEffect(() => {
    const loadClients = async () => {
      const data = await getClients()
      setClients((data as ClientLogo[] | null) || [])
    }
    loadClients()
  }, [])

  const fallback = [
    { name: 'Client A', logo_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Minimal%20modern%20corporate%20logo%20monogram%2C%20blue%20white%20palette&image_size=square_hd' },
    { name: 'Client B', logo_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Minimal%20professional%20corporate%20logo%20wordmark%2C%20navy%20blue%20gradient&image_size=square_hd' },
    { name: 'Client C', logo_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Geometric%20corporate%20logo%20symbol%2C%20tech%20style%2C%20blue%20tones&image_size=square_hd' },
    { name: 'Client D', logo_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Abstract%20corporate%20logo%20wave%20shape%2C%20blue%20gradient&image_size=square_hd' }
  ]

  const list = clients.length ? clients.map(c => ({ name: c.name, logo_url: c.logo_url })) : fallback

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Clients</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">Trusted by leading companies across industries for reliable logistics solutions.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
            {list.map((c, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-center">
                <img src={c.logo_url} alt={c.name} className="w-40 h-40 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
