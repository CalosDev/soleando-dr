'use client'

import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { signInSchema } from '@/lib/validation/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const parsed = signInSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos introducidos.')
      setLoading(false)
      return
    }

    try {
      const result = await authClient.signIn.email({
        ...parsed.data,
      })
      if (result.error) {
        setError('No pudimos validar tus credenciales.')
      } else {
        const session = await authClient.getSession()
        if (session.data?.user.role === 'admin') {
          router.push('/admin')
          router.refresh()
        } else {
          await authClient.signOut()
          setError('No tienes acceso al panel administrativo.')
        }
      }
    } catch {
      setError('El servicio de autenticación no está disponible.')
    } finally {
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
        <p className="eyebrow">Panel privado</p>
        <h1>
          Gestiona tus
          <br />
          <em>experiencias.</em>
        </h1>
        <p className="muted">Accede para publicar y actualizar las ofertas de Soleando.</p>

        <form onSubmit={submit} style={{ marginTop: '20px' }}>
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-sun" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar al panel ↗'}
          </button>
        </form>
      </div>
    </main>
  )
}

