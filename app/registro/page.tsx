import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { getSafeRedirectPath } from '@/lib/auth-redirect'
import { getCurrentUser } from '@/lib/auth-session'
import { isAuthConfigured } from '@/lib/auth'

export const metadata: Metadata = { title: 'Crear cuenta', robots: { index: false, follow: false } }

type RegisterPageProps = { searchParams: Promise<{ next?: string | string[] }> }

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const nextPath = getSafeRedirectPath(typeof params.next === 'string' ? params.next : undefined)
  if (await getCurrentUser()) redirect(nextPath)

  return <main className="customer-auth-page">
    <section className="customer-auth-card" aria-labelledby="register-title">
      <p className="eyebrow">Tu cuenta Soleando</p>
      <h1 id="register-title">Empieza a <em>explorar.</em></h1>
      <p>Crea tu cuenta para acompañarte mejor en tus próximos viajes.</p>
      <SignUpForm nextPath={nextPath} isAuthConfigured={isAuthConfigured} />
    </section>
  </main>
}
