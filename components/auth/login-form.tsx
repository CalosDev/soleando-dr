'use client'

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { getSafeRedirectPath } from '@/lib/validation/auth'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const rawNext = searchParams.get('next')
  const safeNext = getSafeRedirectPath(rawNext, '/cuenta')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) {
      setErrorMessage('Por favor completa todos los campos.')
      return
    }

    setLoading(true)

    try {
      const response = await authClient.signIn.email({
        email: cleanEmail,
        password,
      })

      if (response.error) {
        const errorText = response.error.message?.toLowerCase() || ''
        const errorCode = (response.error as { code?: string }).code || ''
        if (
          errorCode === 'EMAIL_NOT_VERIFIED' ||
          errorText.includes('verify') ||
          errorText.includes('verif')
        ) {
          setErrorMessage(
            'Tu correo electrónico aún no ha sido verificado. Por favor revisa tu bandeja de entrada o haz clic aquí para reenviar la verificación.'
          )
          setUnverifiedEmail(cleanEmail)
        } else if (errorText.includes('invalid') || errorText.includes('credential') || errorText.includes('password')) {
          setErrorMessage('Credenciales inválidas. Verifica tu correo y contraseña.')
        } else if (errorText.includes('banned')) {
          setErrorMessage('Tu cuenta ha sido suspendida. Por favor contacta con soporte.')
        } else {
          setErrorMessage(response.error.message || 'No fue posible iniciar sesión. Verifica tus datos.')
        }
        setLoading(false)
        return
      }

      startTransition(() => {
        router.push(safeNext)
        router.refresh()
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor.'
      setErrorMessage(msg)
      setLoading(false)
    }
  }

  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const isBusy = loading || isPending

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-in fade-in duration-200"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed space-y-2">
              <p>{errorMessage}</p>
              {unverifiedEmail && (
                <Link
                  href={`/verificar-email?email=${encodeURIComponent(unverifiedEmail)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#f64d0b] hover:underline"
                >
                  <span>Ir a la pantalla de verificación</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Contraseña
            </label>
            <Link
              href="/recuperar-contrasena"
              className="text-xs font-semibold text-[#f64d0b] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isBusy}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isBusy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Iniciando sesión…</span>
            </>
          ) : (
            <>
              <span>Iniciar sesión</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="mt-6 text-center text-sm text-stone-600">
        ¿Aún no tienes cuenta?{' '}
        <Link
          href={rawNext ? `/registro?next=${encodeURIComponent(safeNext)}` : '/registro'}
          className="font-bold text-[#f64d0b] hover:underline"
        >
          Regístrate gratis
        </Link>
      </div>
    </div>
  )
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#f64d0b]" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  )
}
