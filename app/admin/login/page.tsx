'use client'

import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function AdminLogin() { const router = useRouter(); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(''); const form = new FormData(event.currentTarget); const result = await authClient.signIn.email({ email: String(form.get('email')), password: String(form.get('password')) }); if (result.error) setError('No pudimos validar tus datos.'); else { router.push('/admin'); router.refresh() } setLoading(false) }
  return <main className="admin-auth"><div className="admin-auth-card"><a className="brand" href="/"><span className="brand-mark">S</span><span>soleando</span></a><p className="eyebrow">Panel privado</p><h1>Gestiona tus<br /><em>experiencias.</em></h1><p className="muted">Accede para publicar y actualizar las ofertas de Soleando.</p><form onSubmit={submit}><label>Email<input name="email" type="email" required /></label><label>Contraseña<input name="password" type="password" required /></label>{error && <p className="form-error">{error}</p>}<button className="button button-sun" disabled={loading}>{loading ? 'Entrando…' : 'Entrar al panel ↗'}</button></form><p className="admin-register-link"><a href="/admin/registro">Crear el primer acceso ↗</a></p></div></main>
}
