import { auth } from '@/lib/auth'
import { readIgPosts } from '@/lib/ig-feed-store'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/sign-out-button'
import { AdminIgManager } from '@/components/admin-ig-manager'

export const dynamic = 'force-dynamic'

export default async function AdminInstagramPage() {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('soleando_demo_session')?.value === 'true'

  let user = isDemo ? { name: 'Administrador Demo', email: 'admin@soleando.com' } : null

  if (!user) {
    try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (session?.user) {
        user = session.user
      }
    } catch {
      // ignore
    }
  }

  if (!user) redirect('/admin/login')

  const igPosts = readIgPosts()

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>soleando</span>
        </a>

        {/* Navigation Tabs in Header */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link
            href="/admin"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#64748b',
              textDecoration: 'none',
              background: 'transparent',
            }}
          >
            🏷️ Catálogo de Ofertas
          </Link>
          <Link
            href="/admin/instagram"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#f64d0b',
              textDecoration: 'none',
              background: '#fff7ed',
            }}
          >
            📸 Carrusel de Instagram
          </Link>
        </nav>

        <div className="admin-user">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {user.name || user.email}
            {isDemo && (
              <span
                style={{
                  background: 'var(--coral)',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Modo Demo
              </span>
            )}
          </span>
          <a href="/#instagram" target="_blank">Ver carrusel en la web ↗</a>
          <SignOutButton />
        </div>
      </header>

      <section className="admin-content" style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 20px' }}>
        <AdminIgManager initialPosts={igPosts} />
      </section>
    </main>
  )
}
