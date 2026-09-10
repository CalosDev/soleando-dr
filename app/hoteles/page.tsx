import type { Metadata } from 'next'
import Image from 'next/image'

import { HotelBookingEngine } from '@/components/hotels/hotel-booking-engine'
import { HotelCard } from '@/components/hotels/hotel-card'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { getFeaturedHotels } from '@/features/catalog/repository'

export const metadata: Metadata = {
  title: 'Hoteles & Resorts en República Dominicana | Soleando',
  description: 'Busca disponibilidad en vivo y descubre hoteles y resorts seleccionados por Soleando.',
}

export const dynamic = 'force-dynamic'

export default async function HotelesPage() {
  const hotels = await getFeaturedHotels()

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />
      <main className="flex-1">
        <section className="relative text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-stone-950">
            <Image src="/sasha-kaunas-xEaAoizNFV8-unsplash.jpg" alt="Hoteles y Resorts" fill className="object-cover object-center brightness-50 contrast-105" priority />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Encuentra tu hotel por el mundo</h1>
            <p className="text-xs sm:text-sm text-stone-200 font-medium max-w-2xl mx-auto">Consulta disponibilidad y precios en vivo con nuestro proveedor hotelero.</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-10">
          <HotelBookingEngine />
        </div>

        {hotels.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="mb-8 space-y-2"><p className="text-xs font-bold tracking-[0.18em] uppercase text-[#f64d0b]">Selección Soleando</p><h2 className="font-serif text-3xl sm:text-4xl text-stone-900">Resorts para inspirarte</h2><p className="text-sm text-stone-600">Una selección editorial. La disponibilidad y los precios finales se confirman en el buscador.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">{hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}</div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
