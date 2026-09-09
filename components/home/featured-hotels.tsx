import { HotelCard } from '@/components/hotels/hotel-card'
import { HotelProviderUnavailableError } from '@/features/hotels/domain/errors'
import type { HotelSearchResult } from '@/features/hotels/domain/types'
import { getFeaturedHotels } from '@/features/hotels/services/hotel-service'

export async function FeaturedHotels() {
  let hotels: HotelSearchResult[] = []
  try {
    hotels = await getFeaturedHotels()
  } catch (error) {
    if (!(error instanceof HotelProviderUnavailableError)) throw error
  }

  return <section className="home-section featured-hotels-section" aria-labelledby="featured-hotels-title"><div className="section-intro section-intro-row"><div><p>Una selección para inspirarte</p><h2 id="featured-hotels-title">Hoteles destacados.</h2></div><span>Opciones de referencia. Confirma tu viaje con nuestro equipo.</span></div>{hotels.length ? <div className="hotel-grid">{hotels.map((hotel) => <HotelCard key={`${hotel.reference.provider}:${hotel.reference.id}`} hotel={hotel} />)}</div> : <p className="mock-notice">La consulta de hoteles no está disponible temporalmente. Contáctanos por WhatsApp para recibir opciones.</p>}</section>
}
