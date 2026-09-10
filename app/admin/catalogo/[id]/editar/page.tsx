import { getAdminCatalogItem, updateCatalogItem } from '@/app/actions/catalog'
import { CatalogForm } from '@/components/admin/catalog-form'
import { requireAdmin } from '@/lib/auth-session'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditCatalogItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin('/admin')
  const { id } = await params
  const item = await getAdminCatalogItem(id)
  if (!item) notFound()

  return (
    <main className="admin-shell">
      <section className="admin-content">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Catálogo editorial</p>
            <h1>Editar contenido</h1>
            <p className="muted">Los cambios se reflejan en las páginas públicas al guardar.</p>
          </div>
        </div>
        <CatalogForm item={item} action={updateCatalogItem.bind(null, item.id)} />
      </section>
    </main>
  )
}
