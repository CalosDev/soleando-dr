import Link from 'next/link'
import { TravelerCard } from '@/components/account/traveler-card'
import { getTravelers } from '@/features/travelers/queries'
import { requireUser } from '@/lib/auth-session'

export default async function AccountTravelersPage() {
  const user = await requireUser('/cuenta/viajeros')
  const travelers = await getTravelers(user.id)

  return <main className="account-content-page">
    <section className="account-content-card account-travelers-page" aria-labelledby="travelers-title">
      <div className="account-page-heading"><div><p className="eyebrow">Mis viajeros</p><h1 id="travelers-title">Tu libreta de <em>viaje.</em></h1></div><Link className="site-button site-button-dark" href="/cuenta/viajeros/nuevo">Agregar viajero</Link></div>
      {travelers.length ? <div className="traveler-list">{travelers.map((traveler) => <TravelerCard key={traveler.id} traveler={traveler} />)}</div> : <div className="account-empty-state"><h2>Aún no tienes viajeros guardados.</h2><p>Guarda las personas con las que viajas frecuentemente para completar futuras reservas más rápido.</p><Link className="site-button site-button-dark" href="/cuenta/viajeros/nuevo">Agregar viajero</Link></div>}
    </section>
  </main>
}
