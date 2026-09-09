'use client'

import { FormEvent, useState, Suspense } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const forbiddenError = searchParams.get('error') === 'forbidden'

  const [error, setError] = useState(
    forbiddenError ? 'No tienes permisos de administrador para acceder a este panel.' : ''
  )
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const cleanEmail = email.trim().toLowerCase()

    try {
      const result = await authClient.signIn.email({
        email: cleanEmail,
        password,
      })

      if (result.error) {
        setError(result.error.message || 'Credenciales administrativas inválidas.')
        setLoading(false)
        return
      }

      const userRole = (result.data?.user as { role?: string } | undefined)?.role
      if (userRole !== 'admin') {
        await authClient.signOut()
        setError('Esta cuenta no cuenta con permisos de administrador. Por favor ingresa desde tu cuenta de viajero.')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Error de conexión con el servicio de autenticación. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <main className="admin-auth">
      <div className="admin-auth-card">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>soleando</span>
        </a>
        <p className="eyebrow">Panel de Administración</p>
        <h1>
          Acceso
          <br />
          <em>restringido.</em>
        </h1>
        <p className="muted">Autenticación exclusiva para personal autorizado de Soleando DR.</p>

        {forbiddenError && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginTop: '16px',
            }}
          >
            ⚠️ <strong>Acceso Denegado:</strong> Tu cuenta no tiene permisos de administrador. Inicia sesión con credenciales autorizadas o dirígete a <a href="/cuenta" style={{ textDecoration: 'underline', fontWeight: 600 }}>Mi Cuenta</a>.
          </div>
        )}

        <form onSubmit={submit} style={{ marginTop: '24px' }}>
          <label>
            Email Corporativo
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@soleando.com.do"
              autoComplete="username"
              required
            />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-sun" disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Verificando…' : 'Ingresar al panel ↗'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="admin-auth" />}>
      <AdminLoginContent />
    </Suspense>
  )
}
