import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { InteractiveGalleryModal } from '@/components/site/interactive-gallery-modal'
import { getCruiseById, getCruises } from '@/features/catalog/repository'
import { siteConfig } from '@/config/site'
import { WhatsappIcon, ArrowUpRightIcon } from '@/components/icons'
import {
  Ship,
  Anchor,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Users,
  Compass,
  FileCheck,
} from 'lucide-react'

interface CruiseDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const cruises = await getCruises()
  return cruises.map((cruise) => ({ id: cruise.id }))
}

export async function generateMetadata({ params }: CruiseDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const cruise = await getCruiseById(id)

  if (!cruise) {
    return {
      title: 'Crucero no encontrado | Soleando DR',
      description: 'El itinerario de crucero solicitado no está disponible.',
    }
  }

  return {
    title: `${cruise.title} | Soleando DR`,
    alternates: { canonical: `/cruceros/${encodeURIComponent(cruise.id)}` },
    description: cruise.description,
    openGraph: {
      title: `${cruise.title} | Soleando DR`,
      description: cruise.description,
      images: [cruise.image],
    },
  }
}

export default async function CruiseDetailPage({ params }: CruiseDetailPageProps) {
  const { id } = await params
  const cruise = await getCruiseById(id)

  if (!cruise) {
    notFound()
  }

  const whatsappMsg = `Hola Soleando, deseo cotizar un camarote para el crucero: "${cruise.title}" (${cruise.line}, saliendo desde ${cruise.departurePort}).`
  const whatsappLink = new URL(siteConfig.whatsappUrl)
  whatsappLink.searchParams.set('text', whatsappMsg)
  const whatsappUrl = whatsappLink.toString()

  // Extract itinerary stops
  const stops = cruise.itinerary.split('·').map((s) => s.trim()).filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1 pb-20">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium" aria-label="Ruta de navegación">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/cruceros" className="hover:text-stone-900 transition-colors">
              Cruceros
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-semibold truncate max-w-xs sm:max-w-md">
              {cruise.title}
            </span>
          </nav>
        </div>

        {/* Header Title Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/80 text-orange-900">
                  <Ship className="w-3.5 h-3.5 text-[#f64d0b]" />
                  <span>{cruise.line}</span>
                </span>
                {cruise.badge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f64d0b] text-white">
                    <Sparkles className="w-3 h-3" />
                    <span>{cruise.badge}</span>
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
                {cruise.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600 pt-1">
                <span className="flex items-center gap-1.5">
                  <Anchor className="w-4 h-4 text-[#f64d0b]" />
                  <span>Duración: <strong>{cruise.duration}</strong></span>
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-stone-400" />
                  <span>Puerto de Salida: <strong>{cruise.departurePort}</strong></span>
                </span>
              </div>
            </div>

            <Link
              href="/cruceros"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#f64d0b] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a cruceros</span>
            </Link>
          </div>
        </section>

        {/* Hero Image */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="relative aspect-16/9 md:aspect-21/9 w-full rounded-3xl overflow-hidden shadow-lg bg-stone-100">
            <Image
              src={cruise.image}
              alt={cruise.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
            <div className="absolute bottom-6 left-6 sm:left-8 text-white space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#fadc40] block">
                Itinerario Seleccionado
              </span>
              <p className="text-sm sm:text-base text-stone-200 max-w-xl font-medium">
                {cruise.itinerary}
              </p>
            </div>
          </div>
        </section>

        {/* Two-Column Grid */}
        {Boolean(cruise.gallery?.length) && <InteractiveGalleryModal images={Array.from(new Set([cruise.image, ...cruise.gallery!])).map((url, index) => ({ url, alt: `${cruise.title} - Foto ${index + 1}` }))} title={cruise.title} badgeText="Crucero Soleando" badgeSubtitle={cruise.departures || 'Consulta fechas y disponibilidad'} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-4">
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  Sobre este Crucero
                </h2>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {cruise.description}
                </p>

                {Boolean(cruise.included?.length) && <div className="pt-4 border-t border-stone-100 space-y-3"><h3 className="font-bold">Incluye</h3>{cruise.included!.map((item, index) => <p key={index} className="flex items-start gap-2 text-sm text-stone-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{item}</p>)}</div>}
                {Boolean(cruise.notIncluded?.length) && <div className="pt-4 border-t border-stone-100 space-y-3"><h3 className="font-bold">No incluye</h3><ul className="list-disc pl-5 text-sm text-stone-600 space-y-2">{cruise.notIncluded!.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
              </div>

              {/* Itinerary Stops */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-6">
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  Puertos e Islas del Itinerario
                </h2>
                <div className="relative border-l-2 border-orange-200 ml-4 pl-6 space-y-6">
                  {stops.map((stop, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#f64d0b] border-2 border-white shadow-xs" />
                      <strong className="text-base font-bold text-stone-900 block">
                        Parada {idx + 1}: {stop}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements & Info */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-4">
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  Información para el viajero
                </h2>
                <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1] flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-[#f64d0b] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block mb-0.5">Documentación</strong>
                      <span>Consulta los requisitos aplicables a tu nacionalidad y al itinerario antes de reservar.</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1] flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block mb-0.5">Fechas de salida</strong>
                      <span className="whitespace-pre-line">{cruise.departures || 'Consulta las fechas disponibles con nuestro equipo.'}</span>
                    </div>
                  </div>
                </div>
                {Boolean(cruise.recommendations?.length) && <ul className="list-disc pl-5 space-y-2 text-sm text-stone-600">{cruise.recommendations!.map((item, index) => <li key={index}>{item}</li>)}</ul>}
              </div>
            </div>

            {/* Right Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xl space-y-6">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block">
                    Precio por persona en cabina doble
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-stone-500">Desde</span>
                    <strong className="font-serif text-4xl text-stone-900 font-normal">
                      {cruise.priceFrom > 0 ? `$${cruise.priceFrom}` : 'Consultar tarifa'}
                    </strong>
                    <span className="text-sm text-stone-500">
                      {cruise.priceFrom > 0 ? cruise.currency : ''}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 pt-1">
                    Consulta la categoría de cabina, inclusiones y precio final con nuestro equipo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-950 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#f64d0b]" />
                    <span>Cotización de Camarote</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Te enviamos opciones en cabina interior, vista al mar o con balcón privado con las mejores tarifas y promociones de la naviera.
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#f64d0b] text-white font-bold text-sm uppercase tracking-wider shadow-md hover:bg-[#e04408] transition-all transform hover:-translate-y-0.5"
                  >
                    <WhatsappIcon className="w-5 h-5 text-white" />
                    <span>Cotizar camarote</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5 text-white" />
                  </a>

                  <Link
                    href="/cruceros"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-100 text-stone-800 font-semibold text-xs hover:bg-stone-200 transition-colors"
                  >
                    <span>Ver otros itinerarios</span>
                  </Link>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Planes de financiamiento disponibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Asistencia en selección de cabina</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
