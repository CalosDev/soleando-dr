import Link from 'next/link'
import { MOCK_HOTELS } from '@/data/mock-hotels'
import { HotelCard } from '@/components/hotels/hotel-card'
import { ArrowUpRight, Hotel } from 'lucide-react'
import { RevealContainer } from '@/components/motion/reveal-container'

export function FeaturedHotels() {
  return (
    <section className="py-20 lg:py-28 bg-[#f5f2eb]/60 border-y border-[#ede8e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f64d0b] mb-2 font-sans">
              <Hotel className="w-3.5 h-3.5" />
              <span>Alojamientos recomendados</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
              Resorts y hoteles<br />
              <em className="text-[#f64d0b] italic font-serif">con esencia caribeña.</em>
            </h2>
          </div>

          <div className="space-y-2 max-w-md">
            <p className="text-sm sm:text-base text-stone-600">
              Propiedades seleccionadas por su estándar de servicio, gastronomía, ubicación frente a la playa y satisfacción de nuestros viajeros.
            </p>
            <Link
              href="/hoteles"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f64d0b] hover:text-[#d43d06] transition-colors"
            >
              <span>Ver catálogo completo de hoteles</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hotels Grid */}
        <RevealContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" staggerDelay={80}>
          {MOCK_HOTELS.slice(0, 6).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </RevealContainer>

        {/* Bottom CTA to /hoteles */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link
            href="/hoteles"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#f64d0b] text-white font-bold text-sm shadow-md hover:bg-[#e04408] transition-all transform hover:-translate-y-0.5 animate-shimmer"
          >
            <span>Explorar todos los alojamientos</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <span className="text-xs text-stone-500 font-medium">
            * Tarifas estimadas sujetas a fechas y ocupación.
          </span>
        </div>
      </div>
    </section>
  )
}
