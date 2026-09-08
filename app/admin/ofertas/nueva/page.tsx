import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OfferForm } from '@/components/offer-form'

export const dynamic = 'force-dynamic'

export default async function NewOfferPage() {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('soleando_demo_session')?.value === 'true'

  let user = isDemo ? { name: 'Demo Admin' } : null
  if (!user) {
    try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (session?.user) user = session.user
    } catch {}
  }
  if (!user) redirect('/admin/login')

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="brand" href="/admin">
          <span className="brand-mark">S</span>
          <span>soleando</span>
        </Link>
        <Link className="text-link" href="/admin">
          ← Volver al panel
        </Link>
      </header>
      <section className="admin-form-page">
        <p className="eyebrow">Nueva oferta</p>
        <h1>
          Crea una nueva
          <br />
          <em>experiencia.</em>
        </h1>
        <p className="muted">
          Publica una nueva oferta para mostrarla en el carrusel y catálogo público.
        </p>
        <OfferForm />
      </section>
    </main>
  )
}
