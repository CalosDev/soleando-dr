import { getAdminUser } from '@/lib/admin-auth'
import { getAdminOffers } from '@/app/actions/offers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminOfferActions } from '@/components/admin-offer-actions'
import { SignOutButton } from '@/components/sign-out-button'
import type { Offer } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const user = await getAdminUser()

  if (!user) redirect('/admin/login')

  let items: Offer[] = []
  try {
    items = await getAdminOffers()
  } catch {
    items = []
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>soleando</span>
        </a>

        <div className="admin-user">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {user.name || user.email}
          </span>
          <a href="/">Ver sitio ↗</a>
          <SignOutButton />
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Panel de ofertas</p>
            <h1>
              Tu catálogo,
              <br />
              <em>siempre listo.</em>
            </h1>
            <p className="muted">
              Gestiona las ofertas temporales mientras construimos la nueva plataforma de viajes.
            </p>
          </div>
          <Link className="button button-sun" href="/admin/ofertas/nueva">
            Nueva oferta ↗
          </Link>
        </div>
        <div className="admin-stats">
          <div>
            <strong>{items.length}</strong>
            <span>Total ofertas</span>
          </div>
          <div>
            <strong>{items.filter((item) => item.status === 'published').length}</strong>
            <span>Publicadas</span>
          </div>
        </div>
        <div className="admin-list">
          <div className="admin-list-head">
            <span>Oferta</span>
            <span>Estado</span>
          </div>
          {items.length ? (
            items.map((item) => (
              <div className="admin-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <small>
                    {item.destination} · {item.category}
                  </small>
                </div>
                <span className={`status-pill status-${item.status}`}>
                  {item.status === 'published' ? 'Publicada' : item.status === 'archived' ? 'Archivada' : 'Borrador'}
                </span>
                <div className="admin-row-actions">
                  <Link href={`/admin/ofertas/${item.id}/editar`}>Editar</Link>
                  <AdminOfferActions id={item.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>Aún no hay ofertas.</p>
              <Link className="text-link" href="/admin/ofertas/nueva">
                Crea la primera oferta ↗
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
