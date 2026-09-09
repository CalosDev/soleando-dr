import { HotelSearchForm } from '@/components/home/hotel-search-form'
import { HotelCard } from '@/components/hotels/hotel-card'
import { PublicPageShell } from '@/components/site/public-page-shell'
import { HotelProviderUnavailableError, HotelSearchValidationError } from '@/features/hotels/domain/errors'
import type { HotelSearchResult } from '@/features/hotels/domain/types'
import { formatHotelSearchSummary, hotelSearchInputFromQuery } from '@/features/hotels/schemas/hotel-search'
import { getFeaturedHotels, searchHotels } from '@/features/hotels/services/hotel-service'

export const metadata = { title: 'Hoteles', description: 'Explora hoteles de referencia para tu próximo viaje con Soleando.' }

export default async function HotelsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const input = hotelSearchInputFromQuery(query)
  const hasSearch = Boolean(input.destination || input.checkIn || input.checkOut)
  const formInitialValues = hasSearch ? {
    destination: input.destination,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: input.rooms.reduce((total, room) => total + room.adults, 0),
    rooms: input.rooms.length,
    childrenAges: input.rooms.flatMap((room) => room.childrenAges),
  } : undefined
  let hotels: HotelSearchResult[] = []
  let message: string | undefined

  try {
    hotels = hasSearch ? await searchHotels(input) : await getFeaturedHotels()
  } catch (error) {
    if (error instanceof HotelSearchValidationError) message = error.message
    else if (error instanceof HotelProviderUnavailableError) message = 'La búsqueda de hoteles no está disponible temporalmente. Contáctanos por WhatsApp.'
    else throw error
  }

  const summary = hasSearch && !message ? formatHotelSearchSummary(input) : undefined
  return <PublicPageShell><section className="hotels-page"><div className="section-intro"><p>Hoteles</p><h1>{summary ? 'Tu búsqueda de hotel.' : 'Encuentra tu próximo hotel.'}</h1><span>{summary || 'Elige un destino, fechas y huéspedes. Las opciones mostradas en desarrollo son referencias visuales.'}</span></div><HotelSearchForm initialValues={formInitialValues} />{message ? <p className="mock-notice" role="alert">{message}</p> : <><p className="mock-notice">Datos de demostración: no representan disponibilidad ni tarifas en tiempo real. Confirma tu viaje con nuestro equipo.</p>{hotels.length ? <div className="hotel-grid hotels-page-grid">{hotels.map((hotel) => <HotelCard key={`${hotel.reference.provider}:${hotel.reference.id}`} hotel={hotel} />)}</div> : <p className="mock-notice">No encontramos opciones de referencia para esa búsqueda. Podemos ayudarte por WhatsApp.</p>}</>}</section></PublicPageShell>
}
