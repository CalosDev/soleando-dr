import type { Metadata } from 'next'
import { requireUser } from '@/lib/auth-session'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'

export const metadata: Metadata = {
  title: 'Mi Cuenta | Soleando DR',
  description: 'Panel de control de cliente en Soleando DR',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireUser('/cuenta')

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-between">
      <SiteHeader variant="solid" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
