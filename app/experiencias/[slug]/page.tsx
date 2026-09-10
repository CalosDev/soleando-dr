import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { StickyMobileBookingBar } from '@/components/site/sticky-mobile-booking-bar'
import { InteractiveGalleryModal } from '@/components/site/interactive-gallery-modal'
import { getExperienceBySlug, getExperiences } from '@/features/catalog/repository'
import { siteConfig } from '@/config/site'
import { WhatsappIcon, ArrowUpRightIcon } from '@/components/icons'
import {
  Compass,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Users,
  Star,
  PhoneCall,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react'

interface ExperienceDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const experiences = await getExperiences()
  return experiences.map((exp) => ({ slug: exp.slug }))
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const exp = await getExperienceBySlug(slug)

  if (!exp) {
    return {
      title: 'Experiencia no encontrada | Soleando DR',
      description: 'La excursión solicitada no está disponible.',
    }
  }

  return {
    title: `${exp.title} | Excursiones Soleando DR`,
    description: exp.description,
    openGraph: {
      title: `${exp.title} - ${exp.destination}`,
      description: exp.description,
      images: [exp.image],
    },
  }
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { slug } = await params
  const exp = await getExperienceBySlug(slug)

  if (!exp) {
    notFound()
  }

  // Similar tours in same category or fallback to other top tours
  const experiences = await getExperiences()
  const similarTours = experiences.filter((item) => item.id !== exp.id)
    .sort((a, b) => (a.category === exp.category ? -1 : 1))
    .slice(0, 3)

  const whatsappMsg = `Hola Soleando DR, me interesa reservar la excursión "${exp.title}" en ${exp.destination} ($${exp.priceFrom} USD / RD$ ${exp.priceRD.toLocaleString('es-DO')}). ¿Tienen disponibilidad para mi fecha?`
  const whatsappUrl = `${siteConfig.whatsappUrl}&text=${encodeURIComponent(whatsappMsg)}`

  const allImages = Array.from(new Set([exp.image, ...exp.gallery])).map((url, i) => ({
    url,
    alt: `${exp.title} - Foto ${i + 1}`,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="bg-[#f5f1ea] border-b border-[#ede8e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium" aria-label="Ruta de navegación">
              <Link href="/" className="hover:text-stone-900 transition-colors">
                Inicio
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <Link href="/experiencias" className="hover:text-stone-900 transition-colors">
                Excursiones & Tours
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-900 font-semibold truncate max-w-xs sm:max-w-md">
                {exp.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Header Title Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              {/* Category, Destination & Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-900">
                  <MapPin className="w-3.5 h-3.5 text-[#f64d0b]" />
                  <span>{exp.destination}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800">
                  <Compass className="w-3.5 h-3.5 text-stone-600" />
                  <span>{exp.category}</span>
                </span>
                {exp.badge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>{exp.badge}</span>
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
                {exp.title}
              </h1>

              {/* Metadata Highlights */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600 pt-1">
                <div className="flex items-center gap-1 text-[#fadc40]">
                  <Star className="w-4 h-4 fill-current" />
                  <strong className="text-stone-900 font-bold text-sm">
                    {exp.rating.toFixed(1)}
                  </strong>
                  <span className="text-stone-500">
                    ({exp.reviewCount} reseñas verificadas)
                  </span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#f64d0b]" />
                  <span>Duración: <strong>{exp.duration}</strong></span>
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{exp.groupType}</span>
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-stone-500" />
                  <span>Dificultad: <strong>{exp.difficulty}</strong></span>
                </span>
              </div>
            </div>

            <Link
              href="/experiencias"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#f64d0b] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver todos los tours</span>
            </Link>
          </div>
        </section>

        {/* Interactive Gallery Showcase Modal */}
        <InteractiveGalleryModal
          images={allImages}
          title={exp.title}
          badgeText="Excursión recomendada por Soleando"
          badgeSubtitle="Salidas diarias y transporte directo desde tu hotel"
        />

        {/* Two-Column Grid: Content & Sticky Booking Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview / Description */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-4">
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  Descripción General
                </h2>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {exp.description}
                </p>

                <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Guías oficiales bilingües certificados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transporte turístico climatizado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Seguro médico de accidentes incluido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Atención personalizada 1 a 1 por WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* What is Included & What is NOT Included (Cocoros style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Included */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-stone-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-serif text-xl font-normal">¿Qué incluye?</h3>
                  </div>
                  <ul className="space-y-3 pt-1">
                    {exp.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Included */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-stone-900">
                    <XCircle className="w-5 h-5 text-rose-500" />
                    <h3 className="font-serif text-xl font-normal">¿Qué NO incluye?</h3>
                  </div>
                  <ul className="space-y-3 pt-1">
                    {exp.notIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600 leading-snug">
                        <XCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Itinerary Timeline (Step by step) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-6">
                <div className="flex items-center gap-2 text-stone-900">
                  <Calendar className="w-5 h-5 text-[#f64d0b]" />
                  <h3 className="font-serif text-2xl font-normal">Itinerario del Día</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600">
                  Horarios y secuencia estimada del recorrido para una experiencia organizada y sin prisas:
                </p>

                <div className="space-y-6 relative pl-4 border-l-2 border-orange-200 ml-2 pt-2">
                  {exp.itinerary.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-[#f64d0b] border-4 border-white shadow-xs" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#f64d0b] block">
                          {item.step}
                        </span>
                        <h4 className="text-base font-bold text-stone-900">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-stone-900">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif text-2xl font-normal">
                    Recomendaciones para el viajero
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600 list-disc pl-5 leading-relaxed">
                  {exp.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Sticky Booking Card (Cocoros style) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xl space-y-6">
                {/* Price Display: USD + DOP */}
                <div className="space-y-1 border-b border-[#ede8e1] pb-5">
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block">
                    Precio por persona
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-stone-500">Desde</span>
                    <strong className="font-serif text-4xl text-stone-900 font-normal">
                      ${exp.priceFrom}
                    </strong>
                    <span className="text-sm text-stone-500 font-medium">
                      {exp.currency}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 font-medium pt-1">
                    Equivalente aprox: <strong className="text-stone-900">RD$ {exp.priceRD.toLocaleString('es-DO')}</strong>
                  </div>
                </div>

                {/* Duration and departures highlight */}
                <div className="space-y-3 text-xs text-stone-700">
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Duración:</span>
                    <strong className="text-stone-900">{exp.duration}</strong>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Modalidad:</span>
                    <strong className="text-stone-900">{exp.groupType}</strong>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Salidas:</span>
                    <strong className="text-emerald-700 font-semibold">Todos los días</strong>
                  </div>
                </div>

                {/* Booking Call-To-Actions (WhatsApp & Call) */}
                <div className="space-y-3 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm tracking-wide shadow-md transition-all transform hover:-translate-y-0.5 animate-shimmer"
                  >
                    <WhatsappIcon className="w-5 h-5 text-white" />
                    <span>Reservar por WhatsApp</span>
                  </a>

                  <Link
                    href="/contacto"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-100 text-stone-800 font-semibold text-xs hover:bg-stone-200 transition-colors"
                  >
                    <span>Consultar disponibilidad por formulario</span>
                  </Link>
                </div>

                {/* Trust and Policies Badges */}
                <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sin cobros sorpresa al abordar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cancelación gratuita hasta 24h antes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f64d0b] shrink-0" />
                    <span>Confirmación inmediata por WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Tours Section (Cocoros style) */}
        {similarTours.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-[#ede8e1]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#f64d0b] block">
                  Recomendadas para ti
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                  Tours similares en República Dominicana
                </h2>
              </div>
              <Link
                href="/experiencias"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f64d0b] hover:text-[#e04408] transition-colors"
              >
                <span>Ver catálogo completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarTours.map((tour) => (
                <article
                  key={tour.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#ede8e1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <Link
                      href={`/experiencias/${tour.slug}`}
                      className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 block cursor-pointer"
                    >
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-106"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="inline-flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full text-[11px]">
                          <MapPin className="w-3 h-3 text-[#fadc40]" />
                          <span>{tour.destination}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full text-[11px]">
                          <Clock className="w-3 h-3 text-stone-300" />
                          <span>{tour.duration}</span>
                        </span>
                      </div>
                    </Link>

                    <div className="p-6 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md">
                          {tour.category}
                        </span>
                        <div className="flex items-center gap-1 text-[#fadc40]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <strong className="text-stone-900 font-bold">{tour.rating.toFixed(1)}</strong>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl text-stone-900 font-normal leading-snug">
                        <Link href={`/experiencias/${tour.slug}`} className="hover:text-[#f64d0b] transition-colors">
                          {tour.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {tour.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-3 border-t border-[#ede8e1] flex items-center justify-between bg-stone-50/50">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Desde</span>
                      <strong className="text-lg font-serif text-stone-900 font-normal">
                        ${tour.priceFrom} <span className="text-xs font-sans text-stone-500 font-normal">USD</span>
                      </strong>
                    </div>

                    <Link
                      href={`/experiencias/${tour.slug}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-[#f64d0b] text-white hover:bg-[#e04408] transition-all shadow-xs"
                    >
                      <span>Ver detalles</span>
                      <ArrowUpRightIcon className="w-2.5 h-2.5 text-white" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <StickyMobileBookingBar
        title={exp.title}
        price={exp.priceFrom}
        currency={exp.currency}
        priceLabel="Desde"
        priceSubtitle="por persona"
        secondaryPrice={`Aprox. RD$ ${exp.priceRD.toLocaleString('es-DO')}`}
        ctaText="Reservar por WhatsApp"
        whatsappUrl={whatsappUrl}
      />

      <SiteFooter />
    </div>
  )
}

