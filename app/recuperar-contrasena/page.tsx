import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Recuperar contraseña | Soleando DR',
  description: 'Solicita un enlace seguro para restablecer tu contraseña en Soleando DR.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RecuperarContrasenaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <ForgotPasswordForm />
      </main>

      <SiteFooter />
    </div>
  )
}
