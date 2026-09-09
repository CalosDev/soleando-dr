import Image from 'next/image'
import Link from 'next/link'
import { formatMoney } from '@/features/hotels/formatters'
import type { HotelSearchResult } from '@/features/hotels/domain/types'

export function HotelCard({ hotel }: { hotel: HotelSearchResult }) {
  const destination = hotel.destination.toLowerCase().replace(/\s+/g, '-')
  return <article className="hotel-card"><div className="hotel-card-image"><Image src={hotel.imageUrl} alt={hotel.name} fill sizes="(max-width: 700px) 88vw, (max-width: 1100px) 45vw, 30vw" /><span>{hotel.highlight ?? 'Referencia visual'}</span></div><div className="hotel-card-copy"><p>{hotel.destination}</p><h3>{hotel.name}</h3><div aria-label={`${hotel.stars} estrellas`} className="hotel-stars">{'★'.repeat(hotel.stars)}</div><span className="hotel-meal-plan">{hotel.mealPlan}</span><div className="hotel-card-footer"><span>{hotel.startingPrice ? `${formatMoney(hotel.startingPrice)} · referencia` : 'Precio por confirmar'}</span><Link href={`/hoteles?destination=${destination}`}>Ver opciones <span aria-hidden="true">↗</span></Link></div></div></article>
}
