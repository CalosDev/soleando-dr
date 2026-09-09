import Image from 'next/image'
import Link from 'next/link'
import { destinations } from '@/data/destinations'

export function PopularDestinations() {
  return <section className="home-section destinations-section" aria-labelledby="destinations-title"><div className="section-intro"><p>Empieza por el lugar</p><h2 id="destinations-title">Destinos que invitan a quedarte.</h2></div><div className="destination-grid">{destinations.map((destination) => <Link key={destination.slug} href={`/hoteles?destination=${destination.slug}`} className="destination-card"><Image src={destination.image} alt={`${destination.name}, ${destination.region}`} fill sizes="(max-width: 700px) 80vw, (max-width: 1100px) 42vw, 20vw" /><span /><div><h3>{destination.name}</h3><p>{destination.region}</p><small>Explorar hoteles <b aria-hidden="true">↗</b></small></div></Link>)}</div></section>
}
