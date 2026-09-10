import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { getCruises } from '@/features/catalog/repository'
import { siteConfig } from '@/config/site'
import { Ship, Anchor, CheckCircle2 } from 'lucide-react'
import { WhatsappIcon, ArrowUpRightIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Cruceros por el Caribe | Soleando DR',
  description: 'Zarpa desde República Dominicana sin visa americana o desde Florida. Cotiza las mejores rutas de cruceros con Soleando.',
}

export default async function CrucerosPage() {
  const cruises = await getCruises()

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1">
        {/* Banner Superior con Portada de Cruceros */}
        <section className="relative text-white pt-20 pb-28 sm:pt-28 sm:pb-36 px-4 sm:px-6 lg:px-8 text-center space-y-5 overflow-hidden">
          {/* Imagen de fondo con tono oscuro uniforme */}
          <div className="absolute inset-0 z-0 bg-stone-950">
            <Image
              src="/alonso-reyes-LWFdBz4d6nE-unsplash.jpg"
              alt="Portada Cruceros por el Caribe"
              fill
              className="object-cover object-center brightness-50 contrast-105"
              priority
            />
            {/* Overlay uniforme para tono oscuro sin franjas */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>

          <h1 className="relative z-10 font-serif text-4xl sm:text-6xl font-normal leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Cruceros por el Mundo
          </h1>
          <p className="relative z-10 text-white font-medium max-w-xl mx-auto text-sm sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pb-4">
            Itinerarios seleccionados con las principales navieras del mundo. Salidas desde todos los puertos del planeta.
          </p>
        </section>

        {/* Listado de Cruceros */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cruises.map((cruise) => (
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
                    className="group/btn inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-xs font-bold bg-[#f64d0b] text-white hover:bg-[#e04408] transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-orange-500/25 hover:scale-105 shrink-0"
                  >
                    <span>Ver detalles</span>
                    <ArrowUpRightIcon className="w-3 h-3 text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
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
