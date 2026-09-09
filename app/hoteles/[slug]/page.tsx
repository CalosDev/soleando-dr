import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { StickyMobileBookingBar } from '@/components/site/sticky-mobile-booking-bar'
import { InteractiveGalleryModal } from '@/components/site/interactive-gallery-modal'
import { getHotelBySlug, getAllHotelSlugs } from '@/features/hotels/services/get-hotel-by-slug'
import { siteConfig } from '@/config/site'
import { WhatsappIcon, ArrowUpRightIcon } from '@/components/icons'
import {
  Star,
  MapPin,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Utensils,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  Wifi,
  Waves,
  Coffee,
} from 'lucide-react'

interface HotelDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllHotelSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: HotelDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const hotel = await getHotelBySlug(slug)

  if (!hotel) {
    return {
      title: 'Hotel no encontrado | Soleando DR',
      description: 'El alojamiento que buscas no está disponible actualmente.',
    }
  }

  return {
    title: `${hotel.details.name} - ${hotel.details.destination} | Soleando DR`,
    description: hotel.details.description,
    openGraph: {
      title: `${hotel.details.name} | Soleando DR`,
      description: hotel.details.description,
      images: hotel.details.images.map((img) => img.url),
    },
  }
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const { slug } = await params
  const hotel = await getHotelBySlug(slug)

  if (!hotel) {
    notFound()
  }

  const { details, searchResult, rooms } = hotel
  const startingPrice = searchResult.startingPrice?.amount || '250.00'
  const currency = searchResult.startingPrice?.currency || 'USD'

  const heroImage = details.images[0]?.url || searchResult.imageUrl || '/soleando-paradise.jpg'
  const fallbackGallery = [
    { url: heroImage, alt: `${details.name} - Vista Principal` },
    { url: '/soleando-paradise.jpg', alt: `${details.name} - Piscinas e Instalaciones` },
    { url: '/soleando-beach.png', alt: `${details.name} - Playa y Costa` },
    { url: '/soleando-sunset.png', alt: `${details.name} - Atardecer Caribeño` },
  ]
  const galleryImages = details.images.length >= 3 ? details.images : fallbackGallery

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium" aria-label="Ruta de navegación">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/hoteles" className="hover:text-stone-900 transition-colors">
              Hoteles
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href={`/hoteles?destination=${searchResult.destinationSlug}`} className="hover:text-stone-900 transition-colors">
              {details.destination}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-semibold truncate max-w-xs sm:max-w-md">
              {details.name}
            </span>
          </nav>
        </div>

        {/* Header Title Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/80 text-orange-900">
                  <MapPin className="w-3.5 h-3.5 text-[#f64d0b]" />
                  <span>{details.destination}</span>
                </span>
                {searchResult.badge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Sparkles className="w-3 h-3" />
                    <span>{searchResult.badge}</span>
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
                {details.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600 pt-1">
                <div className="flex items-center gap-1 text-[#fadc40]">
                  {Array.from({ length: details.stars ?? 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <strong className="ml-1.5 text-stone-900 font-bold">
                    {(details.rating ?? 4.8).toFixed(1)}
                  </strong>
                  <span className="text-stone-500">
                    ({details.reviewCount ?? 120} opiniones verificadas)
                  </span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600 truncate">{details.address}</span>
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/hoteles"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#f64d0b] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a hoteles</span>
            </Link>
          </div>
        </section>

        {/* Photo Gallery Showcase Modal */}
        <InteractiveGalleryModal
          images={galleryImages}
          title={details.name}
          badgeText="Resort Seleccionado por Soleando"
          badgeSubtitle="Todo Incluido con Tarifas Directas Garantizadas"
        />

        {/* Content & Sticky Sidebar Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Left Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Hotel Overview */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-4">
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  Sobre este alojamiento
                </h2>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {details.description}
                </p>

                {/* Highlight badges */}
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-stone-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reserva 100% garantizada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#f64d0b]" />
                    <span>Sin cargos ocultos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#fadc40]" />
                    <span>Asistencia local en RD</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-6">
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  Servicios y amenidades destacadas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {details.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1]/80">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#f64d0b] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-stone-800">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Rooms & Rates */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                    Habitaciones y Tarifas Disponibles
                  </h2>
                  <p className="text-sm text-stone-600">
                    Selecciona tu habitación preferida para cotizar y reservar directamente con un asesor.
                  </p>
                </div>

                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs hover:shadow-md transition-all space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                            {room.name}
                          </h3>
                          <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
                            {room.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-stone-500 font-medium pt-1">
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-stone-400" />
                              <span>Hasta {room.occupancy.maxAdults} adultos, {room.occupancy.maxChildren} niños</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rates for this room */}
                      <div className="pt-4 border-t border-[#ede8e1] space-y-3">
                        {room.rates.map((rate, rIdx) => {
                          const whatsappMsg = `Hola Soleando, me interesa reservar en "${details.name}" la habitación "${room.name}" con tarifa "${rate.mealPlan}" ($${rate.total.amount} ${rate.total.currency}).`
                          const whatsappUrl = `${siteConfig.whatsappUrl}&text=${encodeURIComponent(whatsappMsg)}`

                          return (
                            <div
                              key={rIdx}
                              className="p-4 sm:p-5 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                    <Utensils className="w-3 h-3 text-amber-600" />
                                    <span>{rate.mealPlan}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {rate.cancellationSummary}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-500">
                                  Tarifa por noche sujeta a confirmación de fechas y disponibilidad.
                                </p>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0">
                                <div className="text-left sm:text-right">
                                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Tarifa estimada</span>
                                  <strong className="font-serif text-2xl text-stone-900 font-normal">
                                    ${rate.total.amount}
                                  </strong>
                                  <span className="text-xs text-stone-500 ml-1">
                                    {rate.total.currency} / noche
                                  </span>
                                </div>

                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f64d0b] text-white hover:bg-[#e04408] transition-all transform hover:scale-102 shadow-sm shrink-0"
                                >
                                  <WhatsappIcon className="w-4 h-4 text-white" />
                                  <span>Reservar</span>
                                  <ArrowUpRightIcon className="w-3 h-3 text-white" />
                                </a>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xs space-y-4">
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  Políticas y Horarios
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                      <Clock className="w-4 h-4 text-[#f64d0b]" />
                      <span>Check-in</span>
                    </div>
                    <strong className="text-lg font-serif text-stone-900 font-normal">
                      {details.policies?.checkInTime ?? '15:00'}
                    </strong>
                    <p className="text-xs text-stone-500">Horario oficial de entrada</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                      <Clock className="w-4 h-4 text-[#f64d0b]" />
                      <span>Check-out</span>
                    </div>
                    <strong className="text-lg font-serif text-stone-900 font-normal">
                      {details.policies?.checkOutTime ?? '12:00'}
                    </strong>
                    <p className="text-xs text-stone-500">Horario límite de salida</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Cancelación</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-medium">
                      {details.policies?.cancellationSummary ?? 'Cancelación flexible sujeta a la tarifa seleccionada'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-xl space-y-6">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block">
                    Tarifa de referencia
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-stone-500">Desde</span>
                    <strong className="font-serif text-4xl text-stone-900 font-normal">
                      ${startingPrice}
                    </strong>
                    <span className="text-sm text-stone-500">
                      {currency} / noche
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 pt-1">
                    Impuestos y tasas locales incluidos en la cotización.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-950 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#f64d0b]" />
                    <span>Asesoría personalizada</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Un asesor experto de Soleando te ayuda a verificar disponibilidad para tus fechas exactas y aplicar descuentos para grupos o familias.
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href={`${siteConfig.whatsappUrl}&text=${encodeURIComponent(`Hola Soleando, deseo cotizar una estancia en "${details.name}" (${details.destination}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#f64d0b] text-white font-bold text-sm uppercase tracking-wider shadow-md hover:bg-[#e04408] transition-all transform hover:-translate-y-0.5 animate-shimmer"
                  >
                    <WhatsappIcon className="w-5 h-5 text-white" />
                    <span>Cotizar por WhatsApp</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5 text-white" />
                  </a>

                  <Link
                    href={`/hoteles?destination=${searchResult.destinationSlug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-100 text-stone-800 font-semibold text-xs hover:bg-stone-200 transition-colors"
                  >
                    <span>Ver más hoteles en {details.destination}</span>
                  </Link>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Atención inmediata en español</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Reserva respaldada por agencia autorizada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Opciones de pago flexibles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StickyMobileBookingBar
        title={details.name}
        price={startingPrice}
        currency={currency}
        priceLabel="Desde"
        priceSubtitle="por noche"
        secondaryPrice="Impuestos y tasas incluidos"
        ctaText="Cotizar por WhatsApp"
        whatsappUrl={`${siteConfig.whatsappUrl}&text=${encodeURIComponent(`Hola Soleando, deseo cotizar una estancia en "${details.name}" (${details.destination}).`)}`}
      />

      <SiteFooter />
    </div>
  )
}
