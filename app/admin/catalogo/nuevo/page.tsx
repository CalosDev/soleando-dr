import { createCatalogItem } from '@/app/actions/catalog'
import { CatalogForm } from '@/components/admin/catalog-form'
import { requireAdmin } from '@/lib/auth-session'

export const dynamic = 'force-dynamic'

export default async function NewCatalogItemPage() {
  await requireAdmin('/admin/catalogo/nuevo')

  return (
    <main className="admin-shell">
      <section className="admin-content">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Catálogo editorial</p>
            <h1>Nueva experiencia</h1>
            <p className="muted">Crea un destino, hotel, tour, excursión o crucero. Se puede guardar como borrador.</p>
          </div>
        </div>
        <CatalogForm action={createCatalogItem} />
      </section>
    </main>
  )
}
