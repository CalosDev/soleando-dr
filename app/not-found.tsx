import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full rounded-3xl border border-[#ede8e1] bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f64d0b]">Error 404</p>
        <h1 className="mt-3 font-serif text-3xl text-stone-950 sm:text-4xl">Esta página no existe</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600 sm:text-base">Es posible que el enlace haya cambiado o que la página ya no esté disponible.</p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#f64d0b] px-5 text-sm font-bold text-white transition-colors hover:bg-[#e04408]">Explorar Soleando</Link>
      </section>
    </main>
  )
}
