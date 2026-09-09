import 'server-only'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSafeRedirectPath } from '@/lib/validation/auth'

export interface AuthUser {
  id: string
  name: string
  email: string
  role?: string | null
  image?: string | null
}

/**
 * Returns the currently authenticated user session from Better Auth,
 * or null if unauthenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!auth) return null

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (session?.user) {
      const user = session.user as Record<string, unknown>
      return {
        id: String(user.id || ''),
        name: String(user.name || ''),
        email: String(user.email || ''),
        role: typeof user.role === 'string' ? user.role : 'user',
        image: typeof user.image === 'string' ? user.image : null,
      }
    }
  } catch {
    // Database connection or parsing error; fail gracefully
  }

  return null
}

/**
 * Protects customer pages: redirects to /login?next=... if user is not authenticated.
 */
export async function requireUser(nextPath: string = '/cuenta'): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    const safeNext = encodeURIComponent(getSafeRedirectPath(nextPath, '/cuenta'))
    redirect(`/login?next=${safeNext}`)
  }
  return user
}

/**
 * Protects administrative pages: redirects to /admin/login if not authenticated or not an admin.
 * Requires user to be authenticated and possess the 'admin' role.
 */
export async function requireAdmin(nextPath: string = '/admin'): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    const safeNext = encodeURIComponent(getSafeRedirectPath(nextPath, '/admin'))
    redirect(`/admin/login?next=${safeNext}`)
  }
  if (user.role !== 'admin') {
    redirect('/admin/login?error=forbidden')
  }
  return user
}
