import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { getExperiences } from '@/features/catalog/repository'
import { ExperiencesCatalog } from '@/components/experiences/experiences-catalog'
import { Compass } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Excursiones & Tours en República Dominicana | Soleando DR',
  description: 'Explora las excursiones y tours publicados por Soleando para República Dominicana y el Caribe.',
}

export default async function ExperienciasPage() {
  const experiences = await getExperiences()

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
            Explora las experiencias que Soleando publica con sus detalles, fechas y condiciones confirmadas.
          </p>
        </section>

        {/* Catálogo Interactivo con Buscador Flotante (Overlap) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
          {experiences.length > 0 ? (
            <ExperiencesCatalog initialExperiences={experiences} />
          ) : (
            <div className="mx-auto max-w-2xl rounded-3xl border border-[#ede8e1] bg-white px-6 py-12 text-center shadow-lg sm:px-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-[#f64d0b]">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl text-stone-900 sm:text-3xl">Estamos preparando nuevas experiencias</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-stone-600">
                Publicaremos aquí los tours y excursiones con información confirmada. Mientras tanto, puedes contarnos qué tipo de experiencia buscas.
              </p>
              <Link href="/contacto" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#f64d0b] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#d43d06]">
                Consultar con Soleando
              </Link>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

