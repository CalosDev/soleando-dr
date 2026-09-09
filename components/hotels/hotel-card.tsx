import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Sparkles, Utensils } from 'lucide-react'
import type { MockHotel } from '@/data/mock-hotels'
import type { HotelSearchResult } from '@/features/hotels/domain/types'
import { ArrowUpRightIcon } from '@/components/icons'

interface HotelCardProps {
  hotel: HotelSearchResult | MockHotel
}

export function HotelCard({ hotel }: HotelCardProps) {
  const imageUrl =
    ('imageUrl' in hotel && hotel.imageUrl) ||
    ('image' in hotel && (hotel as MockHotel).image) ||
    '/soleando-paradise.jpg'

  const destinationSlug =
    hotel.destinationSlug ||
    ('slug' in hotel && hotel.slug) ||
    hotel.destination.toLowerCase().replace(/\s+/g, '-')

  const hotelSlug =
    ('slug' in hotel && hotel.slug) ||
    ('reference' in hotel && hotel.reference?.id) ||
    hotel.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const hotelHref = `/hoteles/${hotelSlug}`

  const mealPlan =
    'mealPlans' in hotel && hotel.mealPlans.length > 0
      ? hotel.mealPlans[0]
      : 'mealPlan' in hotel
      ? (hotel as MockHotel).mealPlan
      : 'Todo Incluido'

  const priceAmount =
    'startingPrice' in hotel && hotel.startingPrice
      ? hotel.startingPrice.amount
      : 'priceFrom' in hotel
      ? String((hotel as MockHotel).priceFrom)
      : '200'

  const priceCurrency =
    'startingPrice' in hotel && hotel.startingPrice
      ? hotel.startingPrice.currency
      : 'currency' in hotel
      ? (hotel as MockHotel).currency
      : 'USD'

  const stars = hotel.stars || 5
  const rating = hotel.rating || 4.8
  const reviewCount = hotel.reviewCount || 150

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-[#ede8e1] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      {/* Hotel Image & Badge */}
      <Link href={hotelHref} className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 block cursor-pointer" aria-label={`Ver detalles de ${hotel.name}`}>
        <Image
          src={imageUrl}
          alt={hotel.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
        />

        {/* Overlay subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Destination Chip */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-stone-900 border border-white/40 shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-[#f64d0b]" />
          <span>{hotel.destination}</span>
        </div>

        {/* Optional Badge */}
        {hotel.badge && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/95 to-orange-600/95 backdrop-blur-md text-white border border-white/30 shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>{hotel.badge}</span>
          </div>
        )}

        {/* Stars on top of photo (Glassmorphic pill) */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/65 backdrop-blur-md border border-white/20 text-[#fadc40] shadow-xs">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: stars }).map((_, idx) => (
              <Star key={idx} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-xs font-bold text-white">
            {rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-stone-300 font-normal">
            ({reviewCount})
          </span>
        </div>
      </Link>

      {/* Hotel Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-snug group-hover:text-[#f64d0b] transition-colors line-clamp-1">
            <Link href={hotelHref} className="hover:text-[#f64d0b] transition-colors">
              {hotel.name}
            </Link>
          </h3>

          {/* Meal Plan Pill */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Utensils className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium">{mealPlan}</span>
          </div>

          {/* Amenities tags preview */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {hotel.amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#fdfbf7] text-stone-600 border border-[#ede8e1]"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-[#ede8e1] flex items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
              Precio estimado
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-medium text-stone-500">Desde</span>
              <strong className="font-serif text-2xl text-stone-900 font-normal">
                ${priceAmount}
              </strong>
              <span className="text-[11px] text-stone-500 font-normal">
                {priceCurrency} / noche
              </span>
            </div>
          </div>

          <Link
            href={hotelHref}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-[#f64d0b] text-white hover:bg-[#e04408] transition-all transform hover:scale-102 shadow-sm animate-shimmer"
          >
            <span className="text-white font-bold">Ver detalles</span>
            <ArrowUpRightIcon className="w-3 h-3 text-white" />
          </Link>
        </div>
      </div>
    </article>
  )
}

