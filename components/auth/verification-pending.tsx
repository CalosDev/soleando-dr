'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

export function VerificationPendingCard() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') || ''

  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail)
    }
  }, [initialEmail])

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => {
      setCooldown((c) => c - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function handleResend(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setFeedback({ type: 'error', message: 'Por favor introduce un correo electrónico válido.' })
      return
    }

    setLoading(true)

    try {
      const response = await authClient.sendVerificationEmail({
        email: cleanEmail,
        callbackURL: '/email-verificado',
      })

      if (response.error) {
        setFeedback({
          type: 'error',
          message: response.error.message || 'No fue posible reenviar el correo en este momento. Inténtalo más tarde.',
        })
      } else {
        setFeedback({
          type: 'success',
          message: 'Correo de verificación reenviado exitosamente. Por favor revisa tu bandeja de entrada o spam.',
        })
        setCooldown(60)
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Ocurrió un error al enviar la solicitud. Por favor intenta de nuevo.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#ede8e1] shadow-lg text-center space-y-6">
      {/* Icon */}
      <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100/70 border border-orange-200/80 flex items-center justify-center text-[#f64d0b]">
        <Mail className="w-8 h-8" />
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-stone-900 font-normal">
          Revisa tu correo
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Hemos enviado un enlace de confirmación a{' '}
          {email ? (
            <strong className="text-stone-900 font-bold break-all">{email}</strong>
          ) : (
            'tu correo electrónico'
          )}
          .
        </p>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          role="alert"
          className={`flex items-start gap-2.5 p-4 rounded-xl text-xs sm:text-sm text-left ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{feedback.message}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1] text-xs text-stone-600 text-left space-y-2">
        <p className="font-bold text-stone-800">¿Qué debes hacer ahora?</p>
        <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
          <li>Abre tu aplicación o web de correo.</li>
          <li>Busca el mensaje de <strong>Soleando DR</strong>.</li>
          <li>Haz clic en el botón <strong>&quot;Verificar mi correo&quot;</strong>.</li>
          <li>Si no lo ves, revisa la carpeta de correo no deseado (Spam).</li>
        </ol>
      </div>

      {/* Resend Action Form */}
      <form onSubmit={handleResend} className="space-y-3 pt-2">
        {!initialEmail && (
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Introduce tu correo electrónico"
            className="w-full px-4 py-2.5 rounded-xl border border-[#ede8e1] bg-white text-stone-900 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[#f64d0b]"
          />
        )}

        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : cooldown > 0 ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Reenviar disponible en {cooldown}s</span>
            </>
          ) : (
            <>
              <span>Reenviar correo de verificación</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Back to Login Link */}
      <div className="pt-2 border-t border-[#ede8e1]">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#f64d0b] transition-colors"
        >
          <span>Volver a iniciar sesión</span>
        </Link>
      </div>
    </div>
  )
}
