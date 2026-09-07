import Image from 'next/image'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getPublishedOffers } from '@/app/actions/offers'
import type { Offer } from '@/lib/db/schema'

export default async function OffersPage() {
  let items: Offer[] = []
  try {
    items = await getPublishedOffers()
  } catch {
    items = []
  }

  return <main className="offers-page"><header className="offers-header"><Link className="brand" href="/"><span className="brand-mark">S</span><span>soleando</span></Link><Link className="text-link" href="/">Volver al inicio ↗</Link></header><section className="offers-hero"><h1>Ofertas que<br /><em>se sienten.</em></h1><p className="lead">Excursiones, viajes y experiencias seleccionadas para vivir el Caribe a tu manera.</p></section><section className="offers-grid">{items.length ? items.map((item) => <Link className="public-offer-card" href={`/ofertas/${item.slug}`} key={item.id}><div className="public-offer-image"><Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 700px) 100vw, 33vw" /></div><div className="public-offer-copy"><span>{item.category} · {item.destination}</span><h2>{item.title}</h2><p>{item.description}</p><strong>{item.price ? `${item.currency} ${item.price}` : 'Consultar disponibilidad'} ↗</strong></div></Link>) : <div className="empty-public"><h2>Estamos preparando nuevas experiencias.</h2><p>Escríbenos por WhatsApp y te ayudamos a planear la tuya.</p></div>}</section></main> }
