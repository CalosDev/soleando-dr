import Image from 'next/image'
import Link from 'next/link'

export function CruisesSection() {
  return <section className="cruises-section" id="cruceros"><div className="cruises-image"><Image src="/soleando-sunset.png" alt="Atardecer sobre el Caribe" fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="cruises-copy"><p>También puedes navegar</p><h2>Cruceros a tu manera.</h2><span>Te ayudamos a encontrar una experiencia en el mar que encaje con tus fechas y el tipo de viaje que imaginas.</span><Link className="site-button site-button-light" href="/cruceros">Consultar cruceros</Link></div></section>
}
