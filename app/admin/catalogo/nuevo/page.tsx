import { createCatalogItem } from '@/app/actions/catalog'
import { CatalogForm } from '@/components/admin/catalog-form'
import { requireAdmin } from '@/lib/auth-session'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NewCatalogItemPage() {
  await requireAdmin('/admin/catalogo/nuevo')

  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <Link href="/admin" className="inline-flex min-h-10 items-center text-sm font-semibold text-stone-600 hover:text-stone-950">← Volver al catálogo</Link>
        <div className="mt-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f64d0b]">Catálogo editorial</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">Nueva experiencia</h1><p className="mt-2 text-stone-600">Completa lo esencial, guarda un borrador y publícalo cuando esté listo.</p></div>
        <CatalogForm action={createCatalogItem} />
      </section>
    </main>
  )
}
