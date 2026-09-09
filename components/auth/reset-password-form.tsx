'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const paramError = searchParams.get('error')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Si no hay token o Better Auth reportó error en el callback URL
  if (!token || paramError) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#ede8e1] shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-stone-900 font-normal">
            Enlace inválido o expirado
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            El enlace para restablecer tu contraseña ya no es válido o ha expirado (recuerda que tienen una validez de 1 hora por seguridad).
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/recuperar-contrasena"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>Solicitar un nuevo enlace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (password.length < 8) {
      setErrorMessage('La contraseña debe contener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.')
      return
    }

    setLoading(true)

    try {
      const response = await authClient.resetPassword({
        newPassword: password,
        token: token as string,
      })

      if (response.error) {
        setErrorMessage(
          response.error.message || 'El enlace ha expirado o ya fue utilizado. Por favor solicita uno nuevo.'
        )
      } else {
        setSuccess(true)
      }
    } catch {
      setErrorMessage('Error al conectar con el servidor. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#ede8e1] shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-stone-900 font-normal">
            Contraseña actualizada
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Tu contraseña ha sido modificada con éxito. Todas tus sesiones anteriores han sido cerradas por seguridad.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Iniciar sesión ahora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#ede8e1] shadow-xl space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100/70 border border-orange-200/80 flex items-center justify-center text-[#f64d0b]">
        <Lock className="w-8 h-8" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl text-stone-900 font-normal">
          Nueva contraseña
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Crea una nueva contraseña segura para acceder a tu cuenta de Soleando DR.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nueva Contraseña */}
        <div>
          <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Nueva contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#f64d0b] transition-all"
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

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirm-new-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Confirmar nueva contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirm-new-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#f64d0b] transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando contraseña…</span>
            </>
          ) : (
            <>
              <span>Actualizar contraseña</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
