import Image from 'next/image'
import Link from 'next/link'
import { POPULAR_DESTINATIONS } from '@/data/destinations'
import { ArrowUpRightIcon, MapPinOutlineIcon } from '@/components/icons'
import { RevealContainer } from '@/components/motion/reveal-container'

export function PopularDestinations() {
  return (
    <section className="py-20 lg:py-28 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f64d0b] mb-2 font-sans">
              <MapPinOutlineIcon className="w-3.5 h-3.5" />
              <span>Explora República Dominicana</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
              Destinos donde el sol<br />
              <em className="text-[#f64d0b] italic font-serif">brilla diferente.</em>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-stone-600 max-w-md">
            Desde las costas cristalinas de Punta Cana y Bayahíbe hasta las montañas y selvas de Samaná. Elige tu próximo escenario.
          </p>
        </div>

        {/* Destinations Grid */}
        <RevealContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" staggerDelay={80}>
          {POPULAR_DESTINATIONS.map((dest) => (
            <Link
              key={dest.id}
              href={`/hoteles?destination=${dest.slug}`}
              className="group relative rounded-3xl overflow-hidden aspect-4/3 bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-end p-6 sm:p-7"
            >
              {/* Background Image */}
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

              {/* Card Copy */}
              <div className="relative z-10 space-y-1.5 text-white">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#fadc40] block">
                  {dest.region}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-[#fadc40] transition-colors">
                    {dest.name}
                  </h3>
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all transform group-hover:bg-[#f64d0b] group-hover:rotate-45">
                    <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-white/90">
                    Ver alojamientos en {dest.name} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </RevealContainer>
      </div>
    </section>
  )
}
