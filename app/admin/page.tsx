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

        {/* Navigation Tabs in Header */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link
            href="/admin"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#f64d0b',
              textDecoration: 'none',
              background: '#fff7ed',
            }}
          >
            🏷️ Catálogo de Ofertas
          </Link>
          <Link
            href="/admin/instagram"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#64748b',
              textDecoration: 'none',
              background: 'transparent',
            }}
          >
            📸 Carrusel de Instagram
          </Link>
        </nav>

        <div className="admin-user">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {user.name || user.email}
          </span>
          <a href="/">Ver sitio ↗</a>
          <SignOutButton />
        </div>
      </header>

      <section className="admin-content">
        {/* Banner to jump to Instagram Carrusel */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%)',
            border: '1.5px solid #fed7aa',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <strong style={{ color: '#9a3412', fontSize: '15px', display: 'block', marginBottom: '2px' }}>
              📸 Administrador de Posts & Reels de Instagram
            </strong>
            <span style={{ color: '#c2410c', fontSize: '13px' }}>
              Pega cualquier link de Instagram para autocompletarlo y actualizar el carrusel de la página principal.
            </span>
          </div>
          <Link
            href="/admin/instagram"
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#ea580c',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(234,88,12,0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Gestionar Carrusel de Instagram ↗
          </Link>
        </div>

        <div className="admin-heading">
          <div>
            <p className="eyebrow">Panel de ofertas</p>
            <h1>
              Tu catálogo,
              <br />
              <em>siempre listo.</em>
            </h1>
            <p className="muted">
              Crea ofertas manuales ahora. Más adelante podremos sincronizar las de Instagram sin perder tus ediciones.
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
          <div>
            <strong>{items.filter((item) => item.source === 'instagram').length}</strong>
            <span>Desde Instagram</span>
          </div>
        </div>
        <div className="admin-list">
          <div className="admin-list-head">
            <span>Oferta</span>
            <span>Origen</span>
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
                <span className="source-pill">{item.source === 'instagram' ? 'Instagram' : 'Manual'}</span>
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
