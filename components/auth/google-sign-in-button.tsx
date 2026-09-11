'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { authClient } from '@/lib/auth-client'

interface GoogleSignInButtonProps {
  callbackURL: string
  onError: (message: string) => void
}

export function GoogleSignInButton({ callbackURL, onError }: GoogleSignInButtonProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleGoogleSignIn() {
    setIsPending(true)
    onError('')

    try {
      const response = await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      })

      if (response.error) {
        onError(response.error.message || 'No fue posible continuar con Google. Inténtalo nuevamente.')
        setIsPending(false)
      }
    } catch {
      onError('No fue posible conectar con Google. Inténtalo nuevamente.')
      setIsPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isPending}
      className="w-full inline-flex items-center justify-center gap-3 py-3 px-6 rounded-xl border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 font-bold text-sm shadow-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-black text-[#4285F4]" aria-hidden="true">
          G
        </span>
      )}
      <span>{isPending ? 'Conectando con Google…' : 'Continuar con Google'}</span>
    </button>
  )
}
