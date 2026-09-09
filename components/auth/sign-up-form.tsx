'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { signUpSchema } from '@/lib/validation/auth'

type SignUpFormProps = { nextPath: string; isAuthConfigured: boolean }

export function SignUpForm({ nextPath, isAuthConfigured }: SignUpFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const parsed = signUpSchema.safeParse({ name: formData.get('name'), email: formData.get('email'), password: formData.get('password'), confirmPassword: formData.get('confirmPassword') })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos introducidos.')
      return
    }
    setIsSubmitting(true)
    try {
      const result = await authClient.signUp.email({ name: parsed.data.name, email: parsed.data.email, password: parsed.data.password })
      if (result.error) {
        setError('No fue posible crear la cuenta. Comprueba los datos o intenta iniciar sesión.')
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
    <label htmlFor="register-name">Nombre</label>
    <input id="register-name" name="name" type="text" autoComplete="name" required disabled={!isAuthConfigured || isSubmitting} />
    <label htmlFor="register-email">Correo electrónico</label>
    <input id="register-email" name="email" type="email" autoComplete="email" inputMode="email" required disabled={!isAuthConfigured || isSubmitting} />
    <label htmlFor="register-password">Contraseña</label>
    <input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} required disabled={!isAuthConfigured || isSubmitting} />
    <label htmlFor="register-confirm-password">Confirmar contraseña</label>
    <input id="register-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required disabled={!isAuthConfigured || isSubmitting} />
    {error && <p className="form-error" role="alert">{error}</p>}
    {!isAuthConfigured && <p className="form-error" role="status">El registro aún no está configurado. Inténtalo más tarde.</p>}
    <button className="site-button site-button-dark" type="submit" disabled={!isAuthConfigured || isSubmitting}>{isSubmitting ? 'Creando cuenta…' : 'Crear mi cuenta'}</button>
    <p className="customer-auth-alternate">¿Ya tienes cuenta? <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>Inicia sesión</Link></p>
  </form>
}
