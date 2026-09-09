import Image from 'next/image'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getPublishedOffers } from '@/app/actions/offers'
import type { Offer } from '@/lib/db/schema'
import { getOfferImageSrc } from '@/lib/offer-image'
import { getOfferDisplayTitle } from '@/lib/offer-utils'
import { ArrowUpRightIcon } from '@/components/icons'
import { MissingOfferImage } from '@/components/offers/missing-offer-image'

export default async function OffersPage() {
  let items: Offer[] = []
  try {
    items = await getPublishedOffers()
  } catch {
    items = []
  }

  return (
    <main className="offers-page">
      <header className="offers-catalog-header">
        <Link className="offers-catalog-brand" href="/" aria-label="Soleando, volver al inicio">
          <Image
            src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
            alt="Soleando"
            width={512}
            height={512}
            className="offers-catalog-logo"
            preload
          />
        </Link>
        <Link className="offers-catalog-back" href="/">
          Volver al inicio <ArrowUpRightIcon className="w-3 h-3 inline-block" />
        </Link>
      </header>
      <section className="offers-catalog-hero">
        <h1>
          Ofertas que<br />
          <em>se sienten.</em>
        </h1>
        <p className="lead">Excursiones, viajes y experiencias seleccionadas para vivir el Caribe a tu manera.</p>
      </section>
      <section className={`offers-catalog-grid${items.length === 1 ? ' is-single' : ''}`}>
        {items.length ? (
          items.map((item, index) => {
            const imageSrc = getOfferImageSrc(item.imageUrl)
            const title = getOfferDisplayTitle(item.title)

            return (
              <Link className="offers-catalog-card" href={`/ofertas/${item.slug}`} key={item.id}>
                <div className="offers-catalog-image">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      sizes={items.length === 1 ? '(max-width: 800px) 90vw, 46vw' : '(max-width: 700px) 90vw, 33vw'}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <MissingOfferImage title={title} />
                  )}
                </div>
                <div className="offers-catalog-copy">
                  <span>{item.category} · {item.destination}</span>
                  <h2>{title}</h2>
                  <p>{item.description}</p>
                  <strong className="offers-catalog-price">
                    {item.price ? `${item.currency} ${item.price}` : 'Consultar disponibilidad'}
                    <ArrowUpRightIcon className="w-3 h-3 inline-block" />
                  </strong>
                </div>
              </Link>
            )
          })
        ) : (
          <div className="empty-public">
            <h2>Estamos preparando nuevas experiencias.</h2>
            <p>Escríbenos por WhatsApp y te ayudamos a planear la tuya.</p>
          </div>
        )}
      </section>
    </main>
  )
}
