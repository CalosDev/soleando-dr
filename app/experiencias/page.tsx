import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { EXPERIENCES_DATA } from '@/data/experiences'
import { ExperiencesCatalog } from '@/components/experiences/experiences-catalog'
import { Compass, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Excursiones & Tours en República Dominicana | Soleando DR',
  description: 'Descubre las mejores excursiones a Isla Saona, rutas de buggies, cascadas, Cayo Arena y tours culturales con transporte y traslados incluidos.',
}

export default function ExperienciasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1 pb-20">
        {/* Banner Superior con Identidad Soleando & Cocoros */}
        <section className="bg-stone-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#fadc40]">
            <Compass className="w-3.5 h-3.5" />
            <span>Descubre República Dominicana</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
            Excursiones & Tours Soleando
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Playas de aguas cristalinas, adrenalina en buggies 4x4, cascadas en la selva y recorridos coloniales guiados por expertos locales con atención personalizada.
          </p>
        </section>

        {/* Catálogo Interactivo con Buscador y Filtros */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <ExperiencesCatalog initialExperiences={EXPERIENCES_DATA} />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

