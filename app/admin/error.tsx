'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error('Admin route error', error)
  }, [error])

  return (
    <main className="grid min-h-screen place-items-center bg-[#fdfbf7] px-4 py-12 text-stone-950">
      <section className="w-full max-w-xl rounded-3xl border border-[#ede8e1] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f64d0b]">Soleando Admin</p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">No se pudo cargar el panel</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">No se realizó ningún cambio. Puedes volver a intentar o regresar al catálogo.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={retry} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#f64d0b] px-5 text-sm font-bold text-white transition-colors hover:bg-[#e04408]">Reintentar</button>
          <Link href="/admin" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 px-5 text-sm font-bold text-stone-700 transition-colors hover:bg-stone-50">Volver al catálogo</Link>
        </div>
      </section>
    </main>
  )
}
