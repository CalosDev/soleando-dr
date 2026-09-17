import Link from 'next/link'
import { Archive, Eye, FilePenLine, Plus, Sparkles } from 'lucide-react'

import { archiveCatalogItem, getAdminCatalogItems } from '@/app/actions/catalog'
import { SignOutButton } from '@/components/sign-out-button'
import { requireAdmin } from '@/lib/auth-session'

export const dynamic = 'force-dynamic'

const kindLabels: Record<string, string> = { tour: 'Tour o paquete', excursion_national: 'Excursión nacional', excursion_international: 'Excursión internacional', cruise: 'Crucero' }
const statusLabels: Record<string, string> = { published: 'Publicado', draft: 'Borrador', archived: 'Archivado' }
const statusStyles: Record<string, string> = { published: 'bg-emerald-100 text-emerald-800', draft: 'bg-amber-100 text-amber-900', archived: 'bg-stone-200 text-stone-700' }

function titleOf(content: unknown): string {
  if (!content || typeof content !== 'object') return 'Sin título'
  const value = content as Record<string, unknown>
  return typeof value.title === 'string' ? value.title : 'Sin título'
}

export default async function AdminPage() {
  const currentUser = await requireAdmin('/admin')
  const items = await getAdminCatalogItems()
  const published = items.filter((item) => item.status === 'published').length
  const drafts = items.filter((item) => item.status === 'draft').length

  return <main className="min-h-screen bg-[#fdfbf7] text-stone-950">
    <header className="border-b border-[#ede8e1] bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"><Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-stone-950"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f64d0b] text-sm text-white">S</span><span>Soleando <span className="font-medium text-stone-500">Admin</span></span></Link><div className="flex items-center gap-2"><Link href="/" className="hidden min-h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-stone-600 hover:bg-stone-100 sm:inline-flex"><Eye className="h-4 w-4" />Ver sitio</Link><SignOutButton /></div></div></header>
    <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f64d0b]"><Sparkles className="h-3.5 w-3.5" />Espacio privado</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">Gestiona tu catálogo</h1><p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">Hola, {currentUser.name || currentUser.email}. Crea, revisa y publica experiencias desde un solo lugar.</p></div><Link href="/admin/catalogo/nuevo" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f64d0b] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e04408]"><Plus className="h-4 w-4" />Nuevo contenido</Link></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-[#ede8e1] bg-white p-5 shadow-sm"><p className="text-sm font-medium text-stone-500">Contenido total</p><p className="mt-2 text-3xl font-extrabold tracking-tight">{items.length}</p></div><div className="rounded-2xl border border-[#ede8e1] bg-white p-5 shadow-sm"><p className="text-sm font-medium text-stone-500">Publicado</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-700">{published}</p></div><div className="rounded-2xl border border-[#ede8e1] bg-white p-5 shadow-sm"><p className="text-sm font-medium text-stone-500">Borradores</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-amber-700">{drafts}</p></div></div>
      <section className="mt-8 overflow-hidden rounded-3xl border border-[#ede8e1] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 sm:px-6"><div><h2 className="font-bold text-stone-950">Experiencias</h2><p className="mt-0.5 text-sm text-stone-500">Solo el contenido publicado se muestra al público.</p></div></div>{items.length ? <div className="divide-y divide-stone-100">{items.map((item) => <article key={item.id} className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-wider text-[#f64d0b]">{kindLabels[item.kind] ?? item.kind}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[item.status] ?? statusStyles.draft}`}>{statusLabels[item.status] ?? item.status}</span></div><h3 className="mt-2 truncate text-base font-bold text-stone-950">{titleOf(item.content)}</h3><p className="mt-1 truncate text-sm text-stone-500">/{item.slug}</p></div><div className="flex flex-wrap gap-2"><Link href={`/admin/catalogo/${item.id}/editar`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-stone-200 px-3.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"><FilePenLine className="h-4 w-4" />Editar</Link>{item.status !== 'archived' && <form action={archiveCatalogItem.bind(null, item.id)}><button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-stone-600 hover:bg-stone-100"><Archive className="h-4 w-4" />Archivar</button></form>}</div></article>)}</div> : <div className="px-6 py-14 text-center"><FilePenLine className="mx-auto h-8 w-8 text-[#f64d0b]" /><h3 className="mt-4 text-lg font-bold text-stone-950">Aún no hay contenido</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">Crea tu primera excursión, tour o crucero. Puedes guardarlo como borrador antes de hacerlo público.</p><Link href="/admin/catalogo/nuevo" className="mt-5 inline-flex min-h-10 items-center rounded-xl bg-[#f64d0b] px-4 text-sm font-bold text-white hover:bg-[#e04408]">Crear contenido</Link></div>}</section>
    </section>
  </main>
}
