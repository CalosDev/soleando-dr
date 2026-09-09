import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { offers, type Offer } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { SEED_OFFERS } from '@/lib/seed-data'
import { getPublishedOffers } from '@/app/actions/offers'
import { parseOfferContent } from '@/lib/offer-utils'
import {
  ArrowUpRightIcon,
  WhatsappIcon,
  MapPinOutlineIcon,
  CheckIcon,
  CalendarOutlineIcon,
  SparklesOutlineIcon,
  ChevronLeftIcon,
  ShieldCheckIcon,
} from '@/components/icons'

export const dynamic = 'force-dynamic'

async function getOfferBySlug(slug: string): Promise<Offer | null> {
  try {
    if (!db) throw new Error('Database is not configured')
    const result = await db
      .select()
      .from(offers)
      .where(and(eq(offers.slug, slug), eq(offers.status, 'published')))
    if (result && result[0]) return result[0]
  } catch {}

  try {
    const published = await getPublishedOffers()
    const found = published.find((item) => item.slug === slug)
    if (found) return found
  } catch {}

  const seed = SEED_OFFERS.find((item) => item.slug === slug)
  if (seed) return seed as unknown as Offer

  return null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const offer = await getOfferBySlug(slug)

  if (!offer) {
    return {
      title: 'Oferta no encontrada | Soleando',
      description: 'La experiencia que buscas no está disponible actualmente.',
    }
  }

  return {
    title: `${offer.title} | Soleando`,
    description: offer.description,
    openGraph: {
      title: `${offer.title} | Soleando`,
      description: offer.description,
      images: offer.imageUrl ? [{ url: offer.imageUrl }] : undefined,
    },
  }
}

function formatPriceValue(val?: string | null): string {
  if (!val) return ''
  const clean = val.replace(/[^0-9.]/g, '')
  const num = parseFloat(clean)
  if (isNaN(num)) return val
  return num.toLocaleString('en-US', {
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
  })
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const offer = await getOfferBySlug(slug)

  if (!offer) {
    notFound()
  }

  // Obtener otras ofertas publicadas para la sección recomendada
  let otherOffers: Offer[] = []
  try {
    const all = await getPublishedOffers()
    otherOffers = all.filter((o) => o.slug !== slug).slice(0, 3)
  } catch {}

  const formattedPrice = formatPriceValue(offer.price)
  const currency = offer.currency || 'USD'

  // Organizar el contenido inteligentemente (narrativa, ruta, inclusiones)
  const parsedContent = parseOfferContent(offer.description, offer.includes)

  const whatsappMessage = encodeURIComponent(
    `Hola Soleando, me interesa la experiencia "${offer.title}". ¿Me brindan más información y disponibilidad?`
  )
  const whatsappUrl = `https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0&text=${whatsappMessage}`

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-[#fadc40] selection:text-black"
      style={{ backgroundColor: '#fdfbf7', color: '#1c1917' }}
    >
      {/* Header superior */}
      <header
        className="sticky top-0 z-40 w-full backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(253, 251, 247, 0.92)',
          borderBottom: '1px solid #ede8e1',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Soleando, volver al inicio">
            <Image
              src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
              alt="Soleando"
              width={512}
              height={512}
              className="h-auto w-[58px] object-contain sm:w-[72px]"
              preload
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/ofertas"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors px-3 py-1.5 rounded-full hover:bg-stone-100"
              style={{ color: '#57534e' }}
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              <span>Ver todas las ofertas</span>
            </Link>
            <a
              href="https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
              style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
            >
              <WhatsappIcon className="w-3.5 h-3.5 text-white" />
              <span className="text-white">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        {/* Navegación tipo migas de pan */}
        <nav
          className="flex items-center gap-2 text-xs mb-6 overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ color: '#78716c' }}
          aria-label="Ruta de navegación"
        >
          <Link href="/" className="hover:text-stone-900 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/ofertas" className="hover:text-stone-900 transition-colors">Ofertas</Link>
          <span>/</span>
          <span className="font-medium truncate" style={{ color: '#1c1917' }}>{offer.title}</span>
        </nav>

        {/* Vitrina 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Columna Izquierda: Imagen a tamaño real sin recortes */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
            <div
              className="relative w-full rounded-3xl overflow-hidden shadow-xl"
              style={{
                backgroundColor: '#f5f4f0',
                border: '1px solid #ede8e1',
              }}
            >
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                width={1200}
                height={1200}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto object-contain block rounded-3xl"
              />

              {/* Insignia destacada discreta */}
              {offer.featured && (
                <div className="absolute top-4 left-4 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                    <SparklesOutlineIcon className="w-3.5 h-3.5 text-white" />
                    Destacado
                  </span>
                </div>
              )}
            </div>

            {/* Barra inferior de la foto fuera de la imagen para no tapar el contenido */}
            <div className="flex items-center justify-between gap-3 px-1 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: '#57534e' }}>
                <MapPinOutlineIcon className="w-3.5 h-3.5 text-[#f64d0b]" />
                <span>{offer.destination}</span>
              </span>

            </div>
          </div>

          {/* Columna Derecha: Descripción, detalles y reserva */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            {/* Título y categoría */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 font-sans"
                style={{ backgroundColor: 'rgba(246, 77, 11, 0.1)', color: '#f64d0b' }}
              >
                <MapPinOutlineIcon className="w-3 h-3" />
                <span>{offer.category} · {offer.destination}</span>
              </div>

              <h1
                className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.08] tracking-tight mb-4"
                style={{ color: '#1c1917' }}
              >
                {offer.title}
              </h1>

              {/* Párrafos narrativos limpios y organizados */}
              <div className="space-y-3">
                {parsedContent.narrativeParagraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-base sm:text-lg leading-relaxed font-sans"
                    style={{ color: '#57534e' }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Ruta del viaje / Itinerario de paradas si está disponible */}
            {parsedContent.route && parsedContent.route.length > 0 && (
              <div
                className="p-4 sm:p-5 rounded-2xl shadow-xs"
                style={{
                  backgroundColor: '#fff9f5',
                  border: '1px solid #fed7aa',
                }}
              >
                <span className="text-[11px] uppercase tracking-wider text-[#f64d0b] font-bold block mb-2.5 flex items-center gap-1.5 font-sans">
                  <MapPinOutlineIcon className="w-3.5 h-3.5" />
                  Ruta de la experiencia
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {parsedContent.route.map((stop, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <span
                        className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs"
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e7e2db',
                          color: '#1c1917',
                        }}
                      >
                        {stop}
                      </span>
                      {sIdx < parsedContent.route.length - 1 && (
                        <span className="text-[#f64d0b] text-xs font-bold select-none">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Ficha técnica resumida */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 rounded-2xl shadow-xs"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #ede8e1',
              }}
            >
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block font-sans">Destino</span>
                <p className="text-sm font-medium text-stone-800 leading-snug font-sans">{offer.destination}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block font-sans">Modalidad</span>
                <p className="text-sm font-medium text-stone-800 leading-snug font-sans">{offer.category}</p>
              </div>

              {offer.dateLabel && (
                <div className="space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block font-sans">Fechas</span>
                  <p className="text-sm font-medium text-stone-800 leading-snug font-sans">{offer.dateLabel}</p>
                </div>
              )}
            </div>

            {/* Lista organizada de lo que incluye */}
            {parsedContent.includes && parsedContent.includes.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2 font-sans">
                    <span>¿Qué incluye esta experiencia?</span>
                  </h2>
                  <span className="text-[11px] font-medium text-stone-400 font-sans">
                    {parsedContent.includes.length} {parsedContent.includes.length === 1 ? 'detalle' : 'detalles incluidos'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {parsedContent.includes.map((inc, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl shadow-xs text-xs sm:text-sm text-stone-700 leading-snug font-sans"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.88)',
                        border: '1px solid #ede8e1',
                      }}
                    >
                      {inc.emoji ? (
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm"
                          style={{ backgroundColor: '#f5f4f2' }}
                          role="img"
                          aria-hidden="true"
                        >
                          {inc.emoji}
                        </span>
                      ) : (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: 'rgba(246, 77, 11, 0.1)', color: '#f64d0b' }}
                        >
                          <CheckIcon className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                      <span className="self-center">{inc.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tarjeta de precio y reserva */}
            <div
              className="rounded-3xl shadow-lg p-6 sm:p-8 space-y-6"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #ede8e1',
              }}
            >
              <div
                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5"
                style={{ borderBottom: '1px solid #f2eee8' }}
              >
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                    {formattedPrice ? 'Precio por persona' : 'Disponibilidad'}
                  </span>
                  {formattedPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-stone-500 uppercase">{currency}</span>
                      <strong className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
                        ${formattedPrice}
                      </strong>
                    </div>
                  ) : (
                    <strong className="font-serif text-2xl text-stone-900 font-normal">
                      Consultar disponibilidad
                    </strong>
                  )}
                </div>

                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium self-start sm:self-auto"
                  style={{ backgroundColor: '#ecfdf5', color: '#047857' }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Cupos disponibles
                </span>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    backgroundColor: '#f64d0b',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                  }}
                >
                  <WhatsappIcon className="w-5 h-5 text-white" />
                  <span className="text-white" style={{ color: '#ffffff' }}>Reservar por WhatsApp</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 text-white" />
                </a>

              </div>

              {/* Garantías y tranquilidad */}
              <div
                className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-500"
                style={{ borderTop: '1px solid #f2eee8' }}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Reserva directa y segura</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Atención 1 a 1 por WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sin cargos ocultos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de otras ofertas recomendadas */}
        {otherOffers.length > 0 ? (
          <section className="mt-20 pt-12" style={{ borderTop: '1px solid #ede8e1' }}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#f64d0b] block mb-1">
                  Explora más
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900">
                  Otras experiencias recomendadas
                </h2>
              </div>
              <Link
                href="/ofertas"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-[#f64d0b] transition-colors"
              >
                <span>Ver todas</span>
                <ArrowUpRightIcon className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherOffers.map((other) => {
                const otherPrice = formatPriceValue(other.price)
                return (
                  <Link
                    key={other.id}
                    href={`/ofertas/${other.slug}`}
                    className="group rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #ede8e1',
                    }}
                  >
                    <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                      <Image
                        src={other.imageUrl}
                        alt={other.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
                      >
                        {other.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] text-stone-400 font-medium block truncate mb-1">
                          {other.destination}
                        </span>
                        <h3 className="font-serif text-lg text-stone-900 leading-tight group-hover:text-[#f64d0b] transition-colors line-clamp-2">
                          {other.title}
                        </h3>
                      </div>
                      <div
                        className="mt-4 pt-3 flex items-center justify-between gap-2"
                        style={{ borderTop: '1px solid #f2eee8' }}
                      >
                        <span className="text-xs font-semibold text-stone-800">
                          {otherPrice ? `${other.currency || 'USD'} $${otherPrice}` : 'Consultar'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#f64d0b]">
                          <span>Detalle</span>
                          <ArrowUpRightIcon className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : (
          <section
            className="mt-20 p-8 sm:p-12 rounded-3xl text-center max-w-2xl mx-auto shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #ede8e1',
            }}
          >
            <span
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-xl"
              style={{ backgroundColor: 'rgba(246, 77, 11, 0.1)', color: '#f64d0b' }}
            >
              ✦
            </span>
            <h2 className="font-serif text-2xl text-stone-900 mb-2">
              ¿Quieres un viaje diseñado a tu medida?
            </h2>
            <p className="text-sm text-stone-600 mb-6 max-w-md mx-auto">
              Contáctanos directamente por WhatsApp y nuestro equipo armará una experiencia inolvidable para ti y tus acompañantes.
            </p>
            <a
              href="https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3.5 px-7 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              style={{
                backgroundColor: '#f64d0b',
                color: '#ffffff',
                border: 'none',
              }}
            >
              <WhatsappIcon className="w-4 h-4 text-white" />
              <span className="text-white" style={{ color: '#ffffff' }}>Conversar por WhatsApp</span>
              <ArrowUpRightIcon className="w-3 h-3 text-white" />
            </a>
          </section>
        )}
      </main>

      {/* Footer inferior */}
      <footer
        className="w-full mt-16 py-8"
        style={{
          backgroundColor: '#fdfbf7',
          borderTop: '1px solid #ede8e1',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">soleando</span>
            <span>·</span>
            <span>Excursiones que se quedan contigo</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-stone-900 transition-colors">Inicio</Link>
            <Link href="/ofertas" className="hover:text-stone-900 transition-colors">Ofertas</Link>
            <a
              href="https://instagram.com/soleandodr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              <span>@soleandodr</span>
              <ArrowUpRightIcon className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
