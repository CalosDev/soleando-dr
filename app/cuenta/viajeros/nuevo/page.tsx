import { TravelerForm } from '@/components/account/traveler-form'
import { requireUser } from '@/lib/auth-session'

export default async function NewTravelerPage() {
  await requireUser('/cuenta/viajeros/nuevo')
  return <main className="account-content-page"><section className="account-content-card" aria-labelledby="new-traveler-title"><p className="eyebrow">Mis viajeros</p><h1 id="new-traveler-title">Agregar <em>viajero.</em></h1><p>Guarda solo la información útil para futuras reservas.</p><TravelerForm /></section></main>
}
