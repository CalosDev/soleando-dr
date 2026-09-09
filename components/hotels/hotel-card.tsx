import Image from 'next/image'
import Link from 'next/link'
import type { MockHotel } from '@/data/mock-hotels'

export function HotelCard({ hotel }: { hotel: MockHotel }) {
  return <article className="hotel-card"><div className="hotel-card-image"><Image src={hotel.image} alt={hotel.name} fill sizes="(max-width: 700px) 88vw, (max-width: 1100px) 45vw, 30vw" /><span>{hotel.badge}</span></div><div className="hotel-card-copy"><p>{hotel.destination}</p><h3>{hotel.name}</h3><div aria-label={`${hotel.stars} estrellas`} className="hotel-stars">{'★'.repeat(hotel.stars)}</div><span className="hotel-meal-plan">{hotel.mealPlan}</span><div className="hotel-card-footer"><span>{hotel.priceLabel}</span><Link href={`/hoteles?destination=${hotel.destination.toLowerCase().replace(/\s+/g, '-')}`}>Ver hotel <span aria-hidden="true">↗</span></Link></div></div></article>
}
