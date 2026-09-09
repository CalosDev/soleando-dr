'use client'

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { getSafeRedirectPath } from '@/lib/validation/auth'
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'

function RegisterFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const rawNext = searchParams.get('next')
  const safeNext = getSafeRedirectPath(rawNext, '/cuenta')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanName.length < 2) {
      setErrorMessage('El nombre debe tener al menos 2 caracteres.')
      return
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Por favor introduce un correo electrónico válido.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.')
      return
    }

    setLoading(true)

    try {
      const response = await authClient.signUp.email({
        name: cleanName,
        email: cleanEmail,
        password,
      })

      if (response.error) {
        const err = response.error.message?.toLowerCase() || ''
        if (err.includes('already') || err.includes('exists') || err.includes('unique')) {
          setErrorMessage('Ya existe una cuenta registrada con este correo electrónico.')
        } else {
          setErrorMessage(response.error.message || 'No se pudo completar el registro. Inténtalo de nuevo.')
        }
        setLoading(false)
        return
      }

      startTransition(() => {
        router.push(`/verificar-email?email=${encodeURIComponent(cleanEmail)}`)
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor.'
      setErrorMessage(msg)
      setLoading(false)
    }
  }

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
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="reg-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Nombre completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Carmen Rodríguez"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
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
          <label htmlFor="reg-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Contraseña (mínimo 8 caracteres)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="reg-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Confirmar contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
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
              <span>Creando cuenta…</span>
            </>
          ) : (
            <>
              <span>Crear mi cuenta</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="mt-6 text-center text-sm text-stone-600">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href={rawNext ? `/login?next=${encodeURIComponent(safeNext)}` : '/login'}
          className="font-bold text-[#f64d0b] hover:underline"
        >
          Inicia sesión
        </Link>
      </div>
    </div>
  )
}

export function RegisterForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#f64d0b]" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  )
}
