import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '¡Correo verificado con éxito! | Soleando DR',
  description: 'Tu dirección de correo electrónico ha sido confirmada correctamente.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function EmailVerificadoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#ede8e1] shadow-xl text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-stone-900 font-normal">
              ¡Cuenta verificada!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Tu dirección de correo electrónico ha sido confirmada exitosamente. Ahora tienes acceso completo a Soleando DR para buscar hoteles, gestionar reservas y planificar tu próximo viaje.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Link
              href="/cuenta"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Ir a Mi Cuenta</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-stone-100 text-stone-800 font-semibold text-xs hover:bg-stone-200 transition-colors"
            >
              <span>Explorar la Home</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
