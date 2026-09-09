import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { HotelSearchForm } from '@/components/home/hotel-search-form'
import { HotelCard } from '@/components/hotels/hotel-card'
import { POPULAR_DESTINATIONS } from '@/data/destinations'
import { parseHotelSearchParams } from '@/features/hotels/schemas/hotel-search'
import { searchHotels } from '@/features/hotels/services/search-hotels'
import { type HotelSearchResult } from '@/features/hotels/domain/types'
import { HotelProviderUnavailableError } from '@/features/hotels/domain/errors'
import { siteConfig } from '@/config/site'
import { WhatsappIcon } from '@/components/icons'
import { Hotel, Filter, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { RevealContainer } from '@/components/motion/reveal-container'

export const metadata: Metadata = {
  title: 'Hoteles & Resorts en República Dominicana | Soleando',
  description: 'Compara y encuentra los mejores hoteles todo incluido y resorts en Punta Cana, Bayahíbe, Samaná, Puerto Plata y más.',
}

export const dynamic = 'force-dynamic'

interface HotelesPageProps {
  searchParams: Promise<{
    destination?: string
    checkIn?: string
    checkOut?: string
    adults?: string
    children?: string
    rooms?: string
    childAges?: string
  }>
}

async function HotelesContent({ searchParams }: HotelesPageProps) {
  const params = await searchParams
  const destinationQuery = (typeof params.destination === 'string' ? params.destination : '')?.trim().toLowerCase()
  const checkIn = typeof params.checkIn === 'string' ? params.checkIn : ''
  const checkOut = typeof params.checkOut === 'string' ? params.checkOut : ''
  const adults = params.adults ? parseInt(String(params.adults), 10) : 2
  const children = params.children ? parseInt(String(params.children), 10) : 0
  const rooms = params.rooms ? parseInt(String(params.rooms), 10) : 1

  const parsedInput = parseHotelSearchParams(params)

  let hotels: HotelSearchResult[] = []
  let isProviderUnavailable = false

  try {
    if (parsedInput) {
      hotels = await searchHotels(parsedInput)
    } else {
      // Default / catalog initial search
      const today = new Date()
      const defaultIn = new Date(today.getTime() + 7 * 86400000).toISOString().split('T')[0]
      const defaultOut = new Date(today.getTime() + 11 * 86400000).toISOString().split('T')[0]

      hotels = await searchHotels({
        destination: destinationQuery || 'all',
        checkIn: defaultIn,
        checkOut: defaultOut,
        rooms: [{ adults: 2, childrenAges: [] }],
      })
    }
  } catch (err) {
    if (err instanceof HotelProviderUnavailableError) {
      isProviderUnavailable = true
    } else {
      hotels = []
    }
  }

  const matchedDestination = POPULAR_DESTINATIONS.find(
    (d) => d.slug.toLowerCase() === destinationQuery
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1">
        {/* Search Header Banner */}
        <section className="bg-stone-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#fadc40]">
                <Hotel className="w-3.5 h-3.5" />
                <span>Búsqueda de Alojamientos</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal">
                {matchedDestination ? `Hoteles en ${matchedDestination.name}` : 'Encuentra tu hotel en el Caribe'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300">
                Resorts todo incluido, hoteles boutique y escapadas de descanso seleccionadas por Soleando.
              </p>
            </div>

            {/* Embedded Search Form */}
            <div className="pt-2">
              <HotelSearchForm
                initialDestination={destinationQuery}
                initialCheckIn={checkIn}
                initialCheckOut={checkOut}
                initialAdults={adults}
                initialChildren={children}
                initialRooms={rooms}
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
          {/* Active Filters / Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede8e1]">
            <div className="space-y-1">
              <h2 className="text-xl font-serif text-stone-900 font-normal">
                {isProviderUnavailable
                  ? 'Servicio no disponible'
                  : `${hotels.length} ${hotels.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}`}
              </h2>
              {checkIn && checkOut && !isProviderUnavailable && (
                <p className="text-xs text-stone-500">
                  Fechas seleccionadas: <strong className="text-stone-700">{checkIn}</strong> al <strong className="text-stone-700">{checkOut}</strong> ({adults} adultos, {rooms} hab.)
                </p>
              )}
            </div>

            {!isProviderUnavailable && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/80">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Tarifas referenciales provistas por HotelProvider</span>
              </div>
            )}
          </div>

          {/* Provider Unavailable Banner */}
          {isProviderUnavailable ? (
            <div className="py-16 text-center space-y-4 max-w-md mx-auto bg-white rounded-3xl p-8 border border-amber-200 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">
                Buscador en mantenimiento
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                El motor de búsqueda de hoteles no está disponible en este momento. Puedes comunicarte directamente con nuestro equipo para cotizaciones en vivo.
              </p>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f64d0b] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#e04408] transition-all animate-shimmer"
              >
                <WhatsappIcon className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : hotels.length > 0 ? (
            /* Hotels Grid */
            <RevealContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" staggerDelay={80}>
              {hotels.map((hotel) => (
                <HotelCard key={hotel.reference.id} hotel={hotel} />
              ))}
            </RevealContainer>
          ) : (
            /* Empty State */
            <div className="py-16 text-center space-y-4 max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#ede8e1]">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#f64d0b] flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">
                No encontramos hoteles para ese destino
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Prueba buscando en Punta Cana, Bayahíbe, La Romana o Cap Cana, o contáctanos para asesoría personalizada.
              </p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function HotelesPage(props: HotelesPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7] p-8 text-center">Cargando hoteles...</div>}>
      <HotelesContent {...props} />
    </Suspense>
  )
}
