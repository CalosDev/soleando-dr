import Link from 'next/link'
import { requireAdmin } from '@/lib/auth-session'
import { getAdminOffer } from '@/app/actions/offers'
import { notFound } from 'next/navigation'
import { OfferForm } from '@/components/offer-form'

export const dynamic = 'force-dynamic'

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin('/admin')

  const offer = await getAdminOffer((await params).id)
  if (!offer) notFound()

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
        <p className="eyebrow">Editar oferta</p>
        <h1>
          Afina cada
          <br />
          <em>detalle.</em>
        </h1>
        <p className="muted">
          Actualiza la información, precios y detalles de la oferta.
        </p>
        <OfferForm offer={offer} />
      </section>
    </main>
  )
}

