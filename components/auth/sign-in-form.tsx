'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { signInSchema } from '@/lib/validation/auth'

type SignInFormProps = { nextPath: string; isAuthConfigured: boolean }

export function SignInForm({ nextPath, isAuthConfigured }: SignInFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const parsed = signInSchema.safeParse({ email: formData.get('email'), password: formData.get('password') })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos introducidos.')
      return
    }
    setIsSubmitting(true)
    try {
      const result = await authClient.signIn.email(parsed.data)
      if (result.error) {
        setError('No pudimos validar tus credenciales.')
        return
      }
      router.replace(nextPath)
      router.refresh()
    } catch {
      setError('El servicio de autenticación no está disponible. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <form className="customer-auth-form" onSubmit={onSubmit} noValidate>
    <label htmlFor="login-email">Correo electrónico</label>
    <input id="login-email" name="email" type="email" autoComplete="email" inputMode="email" required disabled={!isAuthConfigured || isSubmitting} />
    <label htmlFor="login-password">Contraseña</label>
    <input id="login-password" name="password" type="password" autoComplete="current-password" required disabled={!isAuthConfigured || isSubmitting} />
    {error && <p className="form-error" role="alert">{error}</p>}
    {!isAuthConfigured && <p className="form-error" role="status">El acceso aún no está configurado. Inténtalo más tarde.</p>}
    <button className="site-button site-button-dark" type="submit" disabled={!isAuthConfigured || isSubmitting}>{isSubmitting ? 'Entrando…' : 'Entrar a mi cuenta'}</button>
    <p className="customer-auth-alternate">¿Aún no tienes cuenta? <Link href={`/registro?next=${encodeURIComponent(nextPath)}`}>Regístrate</Link></p>
  </form>
}
