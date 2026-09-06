'use client'

import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function AdminRegister() {
  const router = useRouter(); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(''); const form = new FormData(event.currentTarget); const result = await authClient.signUp.email({ name: String(form.get('name')), email: String(form.get('email')), password: String(form.get('password')) }); if (result.error) setError('No pudimos crear la cuenta. Revisa los datos.'); else { router.push('/admin'); router.refresh() } setLoading(false) }
  return <main className="admin-auth"><div className="admin-auth-card"><a className="brand" href="/"><span className="brand-mark">S</span><span>soleando</span></a><p className="eyebrow">Primer acceso</p><h1>Crea tu cuenta<br /><em>de admin.</em></h1><p className="muted">Usa este registro para crear el único acceso privado al panel.</p><form onSubmit={submit}><label>Nombre<input name="name" required /></label><label>Email<input name="email" type="email" required /></label><label>Contraseña<input name="password" type="password" minLength={8} required /></label>{error && <p className="form-error">{error}</p>}<button className="button button-sun" disabled={loading}>{loading ? 'Creando…' : 'Crear acceso ↗'}</button></form></div></main>
}
