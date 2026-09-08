'use client'

import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

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

    const cleanEmail = email.trim().toLowerCase()

    try {
      const result = await authClient.signIn.email({
        email: cleanEmail,
        password,
      })
      if (result.error) {
        setError('No pudimos validar tus credenciales.')
      } else {
        router.push('/admin')
        router.refresh()
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-sun" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar al panel ↗'}
          </button>
        </form>
      </div>
    </main>
  )
}

