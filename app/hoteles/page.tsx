import type { Metadata } from 'next'
import Image from 'next/image'
import { BadgeCheck, CreditCard, SearchCheck } from 'lucide-react'

import { HotelSearchForm } from '@/components/home/hotel-search-form'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { getHotelSearchDestination } from '@/features/hotels/config/search-destinations'

export const metadata: Metadata = {
  title: 'Hoteles & Resorts en República Dominicana | Soleando',
  description: 'Busca disponibilidad en vivo y descubre hoteles y resorts seleccionados por Soleando.',
}

export const dynamic = 'force-dynamic'

export default async function HotelesPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>
}) {
  const requestedDestination = (await searchParams).destination ?? ''
  const initialDestination = getHotelSearchDestination(requestedDestination)?.slug ?? ''

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />
      <main className="flex-1">
        <section className="relative min-h-[620px] overflow-hidden px-4 pb-20 pt-28 text-white sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
          <div className="absolute inset-0 z-0 bg-stone-950">
            <Image src="/sasha-kaunas-xEaAoizNFV8-unsplash.jpg" alt="Hoteles y Resorts" fill className="object-cover object-center brightness-50 contrast-105" priority />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#fadc40]">Disponibilidad y tarifas reales</p>
            <h1 className="max-w-4xl font-serif text-4xl font-normal leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] sm:text-6xl">
              Encuentra y reserva tu próximo hotel
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-relaxed text-stone-200 sm:text-lg">
              Busca con la experiencia de Soleando y completa tu reserva en el entorno seguro de nuestro proveedor hotelero.
            </p>
            <div className="mt-10 w-full">
              <HotelSearchForm initialDestination={initialDestination} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8" aria-label="Cómo funciona la reserva">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: SearchCheck, title: 'Busca con datos reales', text: 'El destino, las fechas y la ocupación se consultan directamente al proveedor.' },
              { icon: BadgeCheck, title: 'Compara disponibilidad', text: 'Verás únicamente hoteles, habitaciones y tarifas disponibles para tu búsqueda.' },
              { icon: CreditCard, title: 'Reserva de forma segura', text: 'La confirmación y el pago se completan en el portal seguro del proveedor.' },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-[#ede8e1] bg-white p-6 shadow-xs">
                <Icon className="mb-4 h-6 w-6 text-[#f64d0b]" aria-hidden="true" />
                <h2 className="font-serif text-2xl text-stone-900">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
