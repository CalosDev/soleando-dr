'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Por favor introduce un correo electrónico válido.')
      return
    }

    setLoading(true)

    try {
      // Better Auth requestPasswordReset
      const response = await authClient.requestPasswordReset({
        email: cleanEmail,
        redirectTo: '/restablecer-contrasena',
      })

      if (response.error) {
        // En caso de error técnico del servidor mostramos un mensaje amigable
        setErrorMessage('No pudimos procesar la solicitud en este momento. Por favor inténtalo más tarde.')
      } else {
        // Éxito: mostramos respuesta neutral para proteger contra enumeración de usuarios
        setSubmitted(true)
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#ede8e1] shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-orange-100/70 border border-orange-200/80 flex items-center justify-center text-[#f64d0b]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-stone-900 font-normal">
            Revisa tu bandeja de entrada
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Si existe una cuenta asociada al correo{' '}
            <strong className="text-stone-900 font-bold break-all">{email}</strong>,
            te hemos enviado un enlace para restablecer tu contraseña.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1] text-xs text-stone-600 text-left space-y-1">
          <p className="font-semibold text-stone-800">Ten en cuenta:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed">
            <li>El enlace expirará en 1 hora por seguridad.</li>
            <li>Revisa tu carpeta de correo no deseado o promociones si no lo recibes en unos minutos.</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a iniciar sesión</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#ede8e1] shadow-xl space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100/70 border border-orange-200/80 flex items-center justify-center text-[#f64d0b]">
        <Mail className="w-8 h-8" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl text-stone-900 font-normal">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Introduce tu correo electrónico y te enviaremos un enlace seguro para restablecerla.
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
        <div>
          <label htmlFor="reset-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reset-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#f64d0b] transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando enlace…</span>
            </>
          ) : (
            <>
              <span>Enviar enlace de recuperación</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-[#ede8e1] text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#f64d0b] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a iniciar sesión</span>
        </Link>
      </div>
    </div>
  )
}
