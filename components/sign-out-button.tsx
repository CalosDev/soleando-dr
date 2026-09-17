'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-60"
      onClick={async () => {
        try {
          await authClient.signOut()
        } catch {}
        router.push('/login')
        router.refresh()
      }}
    >
      Salir
    </button>
  )
}
