import { HotelCard } from '@/components/hotels/hotel-card'
import { mockHotels } from '@/data/mock-hotels'

export function FeaturedHotels() {
  return <section className="home-section featured-hotels-section" aria-labelledby="featured-hotels-title"><div className="section-intro section-intro-row"><div><p>Una selección para inspirarte</p><h2 id="featured-hotels-title">Hoteles destacados.</h2></div><span>Opciones de referencia. Confirma tu viaje con nuestro equipo.</span></div><div className="hotel-grid">{mockHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}</div></section>
}
