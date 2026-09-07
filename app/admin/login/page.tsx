'use client'

import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { loginDemoAdmin } from '@/app/actions/auth-demo'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('admin@soleando.com')
  const [password, setPassword] = useState('admin1234')

  async function handleDemoLogin() {
    setLoading(true)
    setError('')
    try {
      await loginDemoAdmin()
      router.push('/admin')
      router.refresh()
    } catch {
      setError('No pudimos activar la sesión demo.')
      setLoading(false)
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (cleanEmail === 'admin@soleando.com' || cleanEmail === 'demo@soleando.com') {
      await loginDemoAdmin()
      router.push('/admin')
      router.refresh()
      return
    }

    try {
      const result = await authClient.signIn.email({
        email: cleanEmail,
        password,
      })
      if (result.error) {
        setError('No pudimos validar tus credenciales. Puedes ingresar con la cuenta Demo.')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Base de datos no disponible. Pulsa el botón para entrar como Demo.')
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

        {/* Caja de Acceso Demo */}
        <div
          style={{
            background: '#f8f5ee',
            border: '1px solid var(--sun)',
            padding: '18px',
            margin: '25px 0 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--ink)',
                textTransform: 'uppercase',
              }}
            >
              ⭐ Cuenta Demo Disponible
            </span>
            <span
              style={{
                fontSize: '10px',
                background: 'var(--coral)',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '6px',
                fontWeight: 600,
              }}
            >
              Listo para probar
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', opacity: 0.9 }}>
            Email: <strong>admin@soleando.com</strong>
            <br />
            Contraseña: <strong>admin1234</strong>
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="button button-sun"
            style={{
              justifyContent: 'center',
              width: '100%',
              cursor: 'pointer',
              border: 'none',
              marginTop: '4px',
            }}
          >
            {loading ? 'Accediendo…' : 'Entrar con Cuenta Demo en 1 Clic ↗'}
          </button>
        </div>

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
        <p className="admin-register-link">
          <a href="/admin/registro">Crear nuevo acceso en base de datos ↗</a>
        </p>
      </div>
    </main>
  )
}

