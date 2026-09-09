import type { Metadata } from 'next'
import { AccountNavigation } from '@/components/account/account-navigation'
import { requireUser } from '@/lib/auth-session'

export const metadata: Metadata = { title: 'Mi cuenta', robots: { index: false, follow: false } }

export default async function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireUser('/cuenta')
  return <div className="account-shell"><AccountNavigation />{children}</div>
}
