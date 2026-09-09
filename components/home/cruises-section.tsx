import Image from 'next/image'
import Link from 'next/link'
import { Ship, Anchor, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { CRUISES_DATA } from '@/data/cruises'
import { siteConfig } from '@/config/site'

export function CruisesSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#1c1917] text-white overflow-hidden relative content-auto">
      {/* Decorative subtle texture/waves background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fadc40_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#fadc40] mb-2 font-sans">
              <Ship className="w-3.5 h-3.5" />
              <span>Navega el Caribe con Soleando</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
              Cruceros que recorren<br />
              <em className="text-[#fadc40] italic font-serif">las mejores islas.</em>
            </h2>
          </div>

          <div className="space-y-2 max-w-md">
            <p className="text-sm sm:text-base text-stone-300">
              Salidas desde puertos locales (La Romana / Santo Domingo sin visado americano) y los grandes puertos de Florida.
            </p>
            <Link
              href="/cruceros"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#fadc40] hover:text-white transition-colors"
            >
              <span>Ver todos los itinerarios de cruceros</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cruises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CRUISES_DATA.map((cruise) => (
            <div
              key={cruise.id}
              className="group bg-stone-900/80 rounded-3xl overflow-hidden border border-stone-800 hover:border-stone-700 shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <Link href={`/cruceros/${cruise.id}`} className="relative aspect-16/10 w-full overflow-hidden block cursor-pointer" aria-label={`Ver detalles de ${cruise.title}`}>
                  <Image
                    src={cruise.image}
                    alt={cruise.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                  {cruise.badge && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f64d0b] text-white">
                      {cruise.badge}
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-semibold text-[#fadc40]">
                    <Anchor className="w-3.5 h-3.5" />
                    <span>{cruise.duration}</span>
                  </div>
                </Link>

                <div className="p-6 space-y-3">
                  <span className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block">
                    {cruise.line}
                  </span>
                  <h3 className="font-serif text-xl text-white font-normal leading-snug group-hover:text-[#fadc40] transition-colors">
                    <Link href={`/cruceros/${cruise.id}`} className="hover:text-[#fadc40] transition-colors">
                      {cruise.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {cruise.itinerary}
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-xs text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{cruise.departurePort}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-3 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-300 uppercase font-semibold block">Desde</span>
                  <strong className="font-serif text-2xl text-white font-normal">
                    ${cruise.priceFrom} <span className="text-xs font-sans text-stone-300">{cruise.currency}</span>
                  </strong>
                </div>

                <Link
                  href={`/cruceros/${cruise.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-[#fadc40] text-stone-900 hover:bg-white transition-all shadow-md"
                >
                  <span>Ver detalles</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
