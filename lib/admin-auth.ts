import 'server-only'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export class AdminAuthorizationError extends Error {
  readonly status: 401 | 403

  constructor(status: 401 | 403) {
    super(status === 401 ? 'Unauthorized' : 'Forbidden')
    this.name = 'AdminAuthorizationError'
    this.status = status
  }
}

export async function getAdminUser(requestHeaders?: Headers) {
  if (!auth) return null

  const session = await auth.api.getSession({
    headers: requestHeaders ?? await headers(),
  })

  if (!session?.user || session.user.role !== 'admin') return null
  return session.user
}

export async function requireAdmin(requestHeaders?: Headers) {
  if (!auth) throw new AdminAuthorizationError(401)

  const session = await auth.api.getSession({
    headers: requestHeaders ?? await headers(),
  })

  if (!session?.user) throw new AdminAuthorizationError(401)
  if (session.user.role !== 'admin') throw new AdminAuthorizationError(403)
  return session.user
}

export function adminAuthorizationResponse(error: unknown) {
  if (error instanceof AdminAuthorizationError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    )
  }

  console.error('[Admin authorization] Session validation failed:', error)
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
