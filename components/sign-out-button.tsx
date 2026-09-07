'use client'

import { authClient } from '@/lib/auth-client'
import { logoutDemoAdmin } from '@/app/actions/auth-demo'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()
  return (
    <button
      className="sign-out-button"
      onClick={async () => {
        try {
          await logoutDemoAdmin()
        } catch {}
        try {
          await authClient.signOut()
        } catch {}
        router.push('/admin/login')
        router.refresh()
      }}
    >
      Salir
    </button>
  )
}

