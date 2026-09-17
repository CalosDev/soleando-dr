export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 py-9 sm:px-6 sm:py-12 lg:px-8" aria-busy="true" aria-label="Cargando administración">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="h-12 rounded-2xl bg-white" />
        <div className="space-y-3"><div className="h-4 w-28 rounded bg-orange-100" /><div className="h-10 max-w-md rounded bg-stone-200" /><div className="h-5 max-w-xl rounded bg-stone-100" /></div>
        <div className="grid gap-4 sm:grid-cols-3"><div className="h-32 rounded-2xl bg-white" /><div className="h-32 rounded-2xl bg-white" /><div className="h-32 rounded-2xl bg-white" /></div>
        <div className="h-80 rounded-3xl bg-white" />
      </div>
      <span className="sr-only">Cargando administración…</span>
    </main>
  )
}
