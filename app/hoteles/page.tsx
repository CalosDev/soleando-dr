import { HotelSearchForm } from '@/components/home/hotel-search-form'
import { HotelCard } from '@/components/hotels/hotel-card'
import { PublicPageShell } from '@/components/site/public-page-shell'
import { mockHotels } from '@/data/mock-hotels'
import { formatSearchSummary, hotelSearchSchema } from '@/lib/hotel-search'

export const metadata = { title: 'Hoteles', description: 'Explora hoteles de referencia para tu próximo viaje con Soleando.' }

export default async function HotelsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const parsed = hotelSearchSchema.safeParse({ destination: typeof query.destination === 'string' ? query.destination.replace(/-/g, ' ') : undefined, checkIn: query.checkIn, checkOut: query.checkOut, adults: query.adults, children: query.children, rooms: query.rooms })
  const summary = parsed.success && parsed.data.destination ? formatSearchSummary(parsed.data) : undefined
  return <PublicPageShell><section className="hotels-page"><div className="section-intro"><p>Hoteles</p><h1>{summary ? 'Tu búsqueda de hotel.' : 'Encuentra tu próximo hotel.'}</h1><span>{summary || 'Elige un destino, fechas y huéspedes. Por ahora mostramos una selección visual de referencia.'}</span></div><HotelSearchForm /><p className="mock-notice">Los hoteles que ves son ejemplos visuales de esta etapa; aún no representan disponibilidad ni tarifas en tiempo real.</p><div className="hotel-grid hotels-page-grid">{mockHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}</div></section></PublicPageShell>
}
