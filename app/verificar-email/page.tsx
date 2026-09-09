import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { VerificationPendingCard } from '@/components/auth/verification-pending'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Verifica tu correo electrónico | Soleando DR',
  description: 'Confirma tu dirección de correo electrónico para activar tu cuenta en Soleando DR.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function VerificarEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#f64d0b]" />
            </div>
          }
        >
          <VerificationPendingCard />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  )
}
