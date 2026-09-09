import Link from 'next/link'
import { requireAdmin } from '@/lib/auth-session'
import { OfferForm } from '@/components/offer-form'

export const dynamic = 'force-dynamic'

export default async function NewOfferPage() {
  await requireAdmin('/admin/ofertas/nueva')

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
