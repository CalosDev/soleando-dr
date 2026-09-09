'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()
  return (
    <button
      className="sign-out-button"
      onClick={async () => {
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
