import Link from 'next/link'
import { getProfile } from '@/features/profile/queries'
import { getTravelers } from '@/features/travelers/queries'
import { requireUser } from '@/lib/auth-session'

export default async function AccountPage() {
  const user = await requireUser('/cuenta')
  const [profile, travelers] = await Promise.all([getProfile(user.id), getTravelers(user.id)])
  return <main className="customer-account-page">
    <section className="customer-account-card" aria-labelledby="account-title">
      <p className="eyebrow">Mi cuenta</p>
      <h1 id="account-title">Hola, <em>{user.name || 'viajero'}.</em></h1>
      <p className="account-intro">{profile ? 'Tu información está lista para futuras reservas.' : 'Completa tu información para hacer tus futuras reservas más rápido.'}</p>
      <div className="account-summary-grid">
        <article><span>Perfil</span><strong>{profile ? 'Completado' : 'Pendiente'}</strong><Link href="/cuenta/perfil">{profile ? 'Ver mi perfil' : 'Completar perfil'}</Link></article>
        <article><span>Viajeros guardados</span><strong>{travelers.length}</strong><Link href="/cuenta/viajeros">Gestionar viajeros</Link></article>
      </div>
    </section>
  </main>
}
