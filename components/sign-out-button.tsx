'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

type SignOutButtonProps = { redirectTo?: string; label?: string }

export function SignOutButton({ redirectTo = '/admin/login', label = 'Salir' }: SignOutButtonProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  return (
    <button
      className="sign-out-button"
      type="button"
      disabled={isSigningOut}
      onClick={async () => {
        setIsSigningOut(true)
        try {
          await authClient.signOut()
        } catch {}
        router.push(redirectTo)
        router.refresh()
      }}
    >
      {isSigningOut ? 'Cerrando sesión…' : label}
    </button>
  )
}

