import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { offers } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { SEED_OFFERS } from '@/lib/seed-data'

export const dynamic = 'force-dynamic'

export default async function OfferDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let offer: any = null

  try {
    const result = await db
      .select()
      .from(offers)
      .where(and(eq(offers.slug, slug), eq(offers.status, 'published')))
    offer = result[0]
  } catch {
    offer = null
  }

  // Fallback a las ofertas semilla si no está en la base de datos
  if (!offer) {
    offer = SEED_OFFERS.find((item) => item.slug === slug)
  }

  if (!offer) {
    notFound()
  }

  const message = encodeURIComponent(`Hola Soleando, me interesa la oferta ${offer.title}.`)

  return (
    <main className="offer-detail">
      <header className="offers-header">
        <Link className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>soleando</span>
        </Link>
        <Link className="text-link" href="/ofertas">
          Ver todas las ofertas ↗
        </Link>
      </header>
      <section className="detail-grid">
        <div className="detail-image">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 55vw"
          />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            {offer.category} · {offer.destination}
          </p>
          <h1>{offer.title}</h1>
          <p className="detail-description">{offer.description}</p>
          {offer.dateLabel && <p className="detail-date">{offer.dateLabel}</p>}
          {offer.includes?.length ? (
            <div>
              <p className="eyebrow">Incluye</p>
              <ul>
                {offer.includes.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="detail-price">
            {offer.price ? (
              <>
                <span>Desde</span>
                <strong>
                  {offer.currency || 'USD'} ${offer.price}
                </strong>
              </>
            ) : (
              <strong>Consulta disponibilidad</strong>
            )}
          </div>
          <a
            className="button button-sun"
            href={`https://wa.me/10000000000?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preguntar por WhatsApp ↗
          </a>
          {offer.instagramUrl && (
            <a
              className="text-link"
              href={offer.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver publicación original ↗
            </a>
          )}
        </div>
      </section>
    </main>
  )
}

