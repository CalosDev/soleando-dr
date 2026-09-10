import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { EXPERIENCES_DATA } from '@/data/experiences'
import { ExperiencesCatalog } from '@/components/experiences/experiences-catalog'
import { Compass, Sparkles } from 'lucide-react'
import Image from 'next/image'

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
        <section className="relative text-white pt-20 pb-28 sm:pt-28 sm:pb-36 px-4 sm:px-6 lg:px-8 text-center space-y-5 overflow-hidden">
          {/* Imagen de fondo con todo el tono oscuro uniforme */}
          <div className="absolute inset-0 z-0 bg-stone-950">
            <Image
              src="/alghozy-fkMae_hrBrI-unsplash.svg"
              alt="Fondo Excursiones"
              fill
              className="object-cover object-center brightness-50 contrast-105"
              priority
            />
            {/* Overlay uniforme para tono oscuro sin franjas */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>

          <h1 className="relative z-10 font-serif text-4xl sm:text-6xl font-normal leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Excursiones & Tours Soleando
          </h1>
          <p className="relative z-10 text-white font-medium max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pb-4">
            Playas de aguas cristalinas, adrenalina en buggies 4x4, cascadas en la selva y recorridos coloniales guiados por expertos locales con atención personalizada.
          </p>
        </section>

        {/* Catálogo Interactivo con Buscador Flotante (Overlap) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
          <ExperiencesCatalog initialExperiences={EXPERIENCES_DATA} />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

