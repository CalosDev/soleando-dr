'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PublicError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error('Public route error', error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full rounded-3xl border border-[#ede8e1] bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f64d0b]">Soleando DR</p>
        <h1 className="mt-3 font-serif text-3xl text-stone-950 sm:text-4xl">No pudimos cargar esta página</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600 sm:text-base">Puede ser algo temporal. Intenta nuevamente o vuelve al inicio para seguir explorando.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={retry} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#f64d0b] px-5 text-sm font-bold text-white transition-colors hover:bg-[#e04408]">Intentar otra vez</button>
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 px-5 text-sm font-bold text-stone-700 transition-colors hover:bg-stone-50">Volver al inicio</Link>
        </div>
      </section>
    </main>
  )
}
