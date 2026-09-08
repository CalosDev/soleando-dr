import { getAdminUser } from '@/lib/admin-auth'
import { readIgPosts } from '@/lib/ig-feed-store'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/sign-out-button'
import { AdminIgManager } from '@/components/admin-ig-manager'

export const dynamic = 'force-dynamic'

export default async function AdminInstagramPage() {
  const user = await getAdminUser()

  if (!user) redirect('/admin/login')

  const igPosts = await readIgPosts()

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
