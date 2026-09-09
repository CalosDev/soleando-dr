import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SignInForm } from '@/components/auth/sign-in-form'
import { getSafeRedirectPath } from '@/lib/auth-redirect'
import { getCurrentUser } from '@/lib/auth-session'
import { isAuthConfigured } from '@/lib/auth'

export const metadata: Metadata = { title: 'Iniciar sesión', robots: { index: false, follow: false } }

type LoginPageProps = { searchParams: Promise<{ next?: string | string[] }> }

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextPath = getSafeRedirectPath(typeof params.next === 'string' ? params.next : undefined)
  if (await getCurrentUser()) redirect(nextPath)

  return <main className="customer-auth-page">
    <section className="customer-auth-card" aria-labelledby="login-title">
      <p className="eyebrow">Tu cuenta Soleando</p>
      <h1 id="login-title">Vuelve a <em>viajar.</em></h1>
      <p>Inicia sesión para gestionar tu cuenta de Soleando.</p>
      <SignInForm nextPath={nextPath} isAuthConfigured={isAuthConfigured} />
    </section>
  </main>
}
