export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-busy="true" aria-label="Cargando contenido">
      <div className="animate-pulse space-y-6">
        <div className="h-5 w-28 rounded bg-stone-200" />
        <div className="h-12 max-w-xl rounded bg-stone-200" />
        <div className="h-5 max-w-2xl rounded bg-stone-100" />
        <div className="grid gap-5 pt-6 md:grid-cols-3">
          <div className="h-72 rounded-3xl bg-stone-100" />
          <div className="h-72 rounded-3xl bg-stone-100" />
          <div className="h-72 rounded-3xl bg-stone-100" />
        </div>
      </div>
      <span className="sr-only">Cargando…</span>
    </main>
  )
}
