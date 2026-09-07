'use client'

import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { loginDemoAdmin } from '@/app/actions/auth-demo'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminRegister() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDemoAccess() {
    setLoading(true)
    try {
      await loginDemoAdmin()
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Error al iniciar sesión demo.')
      setLoading(false)
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const result = await authClient.signUp.email({
        name: String(form.get('name')),
        email: String(form.get('email')),
        password: String(form.get('password')),
      })
      if (result.error) {
        setError('No se pudo conectar a la base de datos. Puedes entrar con el acceso Demo.')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Sin conexión a base de datos. Pulsa el botón abajo para entrar como Demo.')
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
        <p className="eyebrow">Primer acceso</p>
        <h1>
          Crea tu cuenta
          <br />
          <em>de admin.</em>
        </h1>
        <p className="muted">Usa este registro para crear el acceso privado al panel de control.</p>

        <form onSubmit={submit}>
          <label>
            Nombre
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Contraseña
            <input name="password" type="password" minLength={8} required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-sun" disabled={loading}>
            {loading ? 'Creando…' : 'Crear acceso ↗'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--line)', marginTop: '24px', paddingTop: '20px' }}>
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={loading}
            style={{
              background: 'transparent',
              border: '1px dashed var(--sun)',
              color: 'var(--ink)',
              padding: '12px',
              width: '100%',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            ⭐ O saltar registro y entrar en Modo Demo ↗
          </button>
          <p className="admin-register-link" style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link href="/admin/login">¿Ya tienes cuenta? Inicia sesión aquí ↗</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

