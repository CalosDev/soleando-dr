import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth-session'
import { getSafeRedirectPath } from '@/lib/validation/auth'

export const dynamic = 'force-dynamic'

export default async function LoginCompletePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login')

  const { next } = await searchParams
  const safeNext = getSafeRedirectPath(next, '/cuenta')
  const destination = currentUser.role === 'admin'
    ? safeNext.startsWith('/admin') ? safeNext : '/admin'
    : safeNext.startsWith('/admin') ? '/cuenta' : safeNext

  redirect(destination)
}
