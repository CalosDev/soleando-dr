import Link from 'next/link'
import { getAdminUser } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { OfferForm } from '@/components/offer-form'

export const dynamic = 'force-dynamic'

export default async function NewOfferPage() {
  const user = await getAdminUser()
  if (!user) redirect('/admin/login')

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="brand" href="/admin">
          <span className="brand-mark">S</span>
          <span>soleando</span>
        </Link>
        <Link className="text-link" href="/admin">
          ← Volver al panel
        </Link>
      </header>
      <section className="admin-form-page">
        <p className="eyebrow">Nueva oferta</p>
        <h1>
          Crea una nueva
          <br />
          <em>experiencia.</em>
        </h1>
        <p className="muted">
          Publica una nueva oferta para mostrarla en el carrusel y catálogo público.
        </p>
        <OfferForm />
      </section>
    </main>
  )
}
