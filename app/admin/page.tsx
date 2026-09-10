import Link from 'next/link'

import { archiveCatalogItem, getAdminCatalogItems } from '@/app/actions/catalog'
import { SignOutButton } from '@/components/sign-out-button'
import { requireAdmin } from '@/lib/auth-session'

export const dynamic = 'force-dynamic'

const kindLabels: Record<string, string> = {
  destination: 'Destino', hotel: 'Hotel', tour: 'Tour', excursion_national: 'Excursión nacional',
  excursion_international: 'Excursión internacional', cruise: 'Crucero',
}

function titleOf(content: unknown): string {
  if (typeof content !== 'object' || content === null) return 'Sin título'
  const values = content as Record<string, unknown>
  return typeof values.title === 'string' ? values.title : typeof values.name === 'string' ? values.name : 'Sin título'
}

export default async function AdminPage() {
  const user = await requireAdmin('/admin')
  const items = await getAdminCatalogItems()
  const published = items.filter((item) => item.status === 'published').length
  const drafts = items.filter((item) => item.status === 'draft').length

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <a className="brand" href="/"><span className="brand-mark">S</span><span>soleando</span></a>
        <div className="admin-user"><span>{user.name || user.email}</span><a href="/">Ver sitio ↗</a><SignOutButton /></div>
      </header>
      <section className="admin-content">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Administración</p>
            <h1>Catálogo editorial</h1>
            <p className="muted">Gestiona destinos, hoteles, tours, excursiones nacionales e internacionales y cruceros.</p>
          </div>
          <Link className="button button-sun" href="/admin/catalogo/nuevo">Nuevo contenido ↗</Link>
        </div>
        <div className="admin-stats">
          <div><strong>{items.length}</strong><span>Total</span></div>
          <div><strong>{published}</strong><span>Publicados</span></div>
          <div><strong>{drafts}</strong><span>Borradores</span></div>
        </div>
        <div className="admin-list">
          <div className="admin-list-head"><span>Contenido</span><span>Estado</span></div>
          {items.length ? items.map((item) => (
            <div className="admin-row" key={item.id}>
              <div><strong>{titleOf(item.content)}</strong><small>{kindLabels[item.kind] ?? item.kind} · /{item.slug}</small></div>
              <span className={`status-pill status-${item.status}`}>{item.status === 'published' ? 'Publicado' : item.status === 'draft' ? 'Borrador' : 'Archivado'}</span>
              <div className="admin-row-actions">
                <Link href={`/admin/catalogo/${item.id}/editar`}>Editar</Link>
                {item.status !== 'archived' && <form action={archiveCatalogItem.bind(null, item.id)}><button type="submit">Archivar</button></form>}
              </div>
            </div>
          )) : <div className="empty-state"><p>Aún no hay contenido.</p><Link className="text-link" href="/admin/catalogo/nuevo">Crea el primero ↗</Link></div>}
        </div>
      </section>
    </main>
  )
}
