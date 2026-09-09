import { SignOutButton } from '@/components/sign-out-button'
import { requireUser } from '@/lib/auth-session'

export default async function AccountPage() {
  const user = await requireUser('/cuenta')
  return <main className="customer-account-page">
    <section className="customer-account-card" aria-labelledby="account-title">
      <p className="eyebrow">Mi cuenta</p>
      <h1 id="account-title">Hola, <em>{user.name || 'viajero'}.</em></h1>
      <dl>
        <div><dt>Nombre</dt><dd>{user.name || 'No indicado'}</dd></div>
        <div><dt>Correo electrónico</dt><dd>{user.email}</dd></div>
      </dl>
      <SignOutButton redirectTo="/" label="Cerrar sesión" />
    </section>
  </main>
}
