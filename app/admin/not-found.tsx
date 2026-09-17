import Link from 'next/link'
import { requireAdmin } from '@/lib/auth-session'

export default async function AdminNotFound() {
  await requireAdmin('/admin')

  return (
    <main className="grid min-h-screen place-items-center bg-[#fdfbf7] px-4 py-12 text-stone-950">
      <section className="w-full max-w-xl rounded-3xl border border-[#ede8e1] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f64d0b]">Soleando Admin · 404</p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Este recurso no está disponible</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">El contenido pudo haber sido eliminado o el enlace no corresponde al catálogo actual.</p>
        <Link href="/admin" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#f64d0b] px-5 text-sm font-bold text-white transition-colors hover:bg-[#e04408]">Volver al catálogo</Link>
      </section>
    </main>
  )
}
