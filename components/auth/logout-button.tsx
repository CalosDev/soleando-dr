'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { LogOut, Loader2 } from 'lucide-react'

interface LogoutButtonProps {
  className?: string
  redirectTo?: string
  children?: React.ReactNode
}

export function LogoutButton({
  className = '',
  redirectTo = '/',
  children,
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    if (isLoading) return
    setIsLoading(true)
    try {
      await authClient.signOut()
    } catch {
      // Ignore network errors on signout
    } finally {
      setIsLoading(false)
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={
        className ||
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50'
      }
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
      ) : (
        <LogOut className="w-4 h-4 text-stone-500" />
      )}
      <span>{children || (isLoading ? 'Cerrando sesión…' : 'Cerrar sesión')}</span>
    </button>
  )
}
