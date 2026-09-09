import { PublicPageShell } from '@/components/site/public-page-shell'

export default function HotelsLoading() {
  return <PublicPageShell><section className="hotels-page" aria-busy="true" aria-label="Cargando hoteles"><div className="section-intro"><p>Hoteles</p><h1>Buscando opciones.</h1><span>Estamos preparando las opciones para tu consulta.</span></div><div className="hotel-grid hotels-page-grid">{Array.from({ length: 3 }, (_, index) => <div className="hotel-card" key={index}><div className="hotel-card-image hotel-card-skeleton" /><div className="hotel-card-copy hotel-card-skeleton-copy" /></div>)}</div></section></PublicPageShell>
}
