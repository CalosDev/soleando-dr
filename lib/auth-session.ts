import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function getSession() {
  if (!auth) return null
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  return (await getSession())?.user ?? null
}

export async function requireUser(nextPath = '/cuenta') {
  const user = await getCurrentUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  return user
}
