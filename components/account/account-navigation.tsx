import Link from 'next/link'
import { SignOutButton } from '@/components/sign-out-button'

export function AccountNavigation() {
  return <header className="account-navigation">
    <div>
      <Link className="account-brand" href="/cuenta">Soleando</Link>
      <nav aria-label="Navegación de cuenta">
        <Link href="/cuenta">Resumen</Link>
        <Link href="/cuenta/perfil">Mi perfil</Link>
        <Link href="/cuenta/viajeros">Mis viajeros</Link>
      </nav>
    </div>
    <SignOutButton redirectTo="/" label="Cerrar sesión" />
  </header>
}
