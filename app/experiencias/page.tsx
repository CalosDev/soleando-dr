import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { getExperiences } from '@/features/catalog/repository'
import { ExperiencesCatalog } from '@/components/experiences/experiences-catalog'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Excursiones nacionales e internacionales | Soleando',
  description: 'Explora excursiones nacionales, experiencias internacionales y paquetes publicados por Soleando.',
}

export default async function ExperienciasPage() {
  const experiences = await getExperiences()

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1 pb-20">
        {/* Banner superior de excursiones */}
        <section className="relative text-white pt-20 pb-28 sm:pt-28 sm:pb-36 px-4 sm:px-6 lg:px-8 text-center space-y-5 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-stone-950">
            <Image
              src="/alghozy-fkMae_hrBrI-unsplash.svg"
              alt="Fondo Excursiones"
              fill
              className="object-cover object-center brightness-50 contrast-105"
              priority
            />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>

          <h1 className="relative z-10 font-serif text-4xl sm:text-6xl font-normal leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Excursiones nacionales e internacionales
          </h1>
          <p className="relative z-10 text-white font-medium max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pb-4">
            Desde escapadas por República Dominicana hasta experiencias internacionales y paquetes para tu próximo viaje.
          </p>
        </section>

        {/* Catálogo interactivo */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
          <ExperiencesCatalog initialExperiences={experiences} />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

