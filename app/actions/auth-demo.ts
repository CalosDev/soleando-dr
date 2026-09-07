'use server'

import { cookies } from 'next/headers'

export async function loginDemoAdmin() {
  const cookieStore = await cookies()
  cookieStore.set('soleando_demo_session', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return { ok: true }
}

export async function logoutDemoAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('soleando_demo_session')
  return { ok: true }
}

export async function isDemoAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('soleando_demo_session')?.value === 'true'
}
