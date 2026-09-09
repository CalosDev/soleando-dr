import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { CRUISES_DATA } from '@/data/cruises'
import { siteConfig } from '@/config/site'
import { Ship, Anchor, CheckCircle2 } from 'lucide-react'
import { WhatsappIcon, ArrowUpRightIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Cruceros por el Caribe | Soleando DR',
  description: 'Zarpa desde República Dominicana sin visa americana o desde Florida. Cotiza las mejores rutas de cruceros con Soleando.',
}

export default function CrucerosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1">
        {/* Banner Superior */}
        <section className="bg-stone-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#fadc40]">
            <Ship className="w-3.5 h-3.5" />
            <span>Navega el Caribe</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal">
            Cruceros por el Caribe
          </h1>
          <p className="text-stone-300 max-w-xl mx-auto text-sm sm:text-base">
            Itinerarios seleccionados con las principales navieras del mundo. Salidas desde puertos dominicanos y Florida.
          </p>
        </section>

        {/* Listado de Cruceros */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CRUISES_DATA.map((cruise) => (
              <article
                key={cruise.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#ede8e1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/cruceros/${cruise.id}`} className="relative aspect-16/10 w-full overflow-hidden block cursor-pointer" aria-label={`Ver detalles de ${cruise.title}`}>
                    <Image
                      src={cruise.image}
                      alt={cruise.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 hover:scale-106"
                    />
                    {cruise.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f64d0b] text-white">
                        {cruise.badge}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-semibold text-[#fadc40] bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      <Anchor className="w-3.5 h-3.5" />
                      <span>{cruise.duration}</span>
                    </div>
                  </Link>

                  <div className="p-6 space-y-3">
                    <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block">
                      {cruise.line}
                    </span>
                    <h2 className="font-serif text-xl text-stone-900 font-normal leading-snug">
                      <Link href={`/cruceros/${cruise.id}`} className="hover:text-[#f64d0b] transition-colors">
                        {cruise.title}
                      </Link>
                    </h2>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {cruise.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Puerto: <strong>{cruise.departurePort}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4 border-t border-[#ede8e1] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Desde</span>
                    <strong className="text-xl font-serif text-stone-900 font-normal">
                      ${cruise.priceFrom} <span className="text-xs font-sans text-stone-500 font-normal">{cruise.currency}</span>
                    </strong>
                  </div>

                  <Link
                    href={`/cruceros/${cruise.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-[#f64d0b] text-white hover:bg-[#e04408] transition-all shadow-xs"
                  >
                    <span>Ver detalles</span>
                    <ArrowUpRightIcon className="w-2.5 h-2.5 text-white" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
