import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-session'
import { LoginForm } from '@/components/auth/login-form'
import { getAuthFeatures } from '@/lib/auth-features'
import { ArrowLeft, Sparkles, ShieldCheck, Compass, Palmtree } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Iniciar sesión | Soleando DR',
  description: 'Accede a tu cuenta de cliente en Soleando DR para gestionar tus viajes y reservas.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginPage() {
  const { googleSignInEnabled } = getAuthFeatures()
  const user = await getCurrentUser()
  if (user) {
    redirect('/cuenta')
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] relative flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden selection:bg-[#f64d0b]/20 selection:text-[#f64d0b]">

      {/* ── Center Login Card ── */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-stone-200/70 border border-[#ede8e1] relative overflow-hidden">
          {/* Top Decorative Sunset Accent Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#f64d0b] via-[#ff8438] to-[#FFE600]" />

          {/* Card Header */}
          <div className="text-center mb-1 pt-1">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <Image
                src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
                alt="Soleando Logo"
                width={170}
                height={50}
                className="h-28 w-auto mx-auto object-contain drop-shadow-xs scale-125 -mt-2 -mb-4"
                priority
              />
            </Link>

            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1221]">
              Bienvenido de vuelta
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-600 max-w-xs mx-auto">
              Inicia sesión para gestionar tus viajes, cotizaciones y reservas exclusivas
            </p>
          </div>

          {/* Login Form Component */}
          <LoginForm googleSignInEnabled={googleSignInEnabled} />

          {/* Trust Highlights Inside Card */}
          <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-[10px] text-stone-500 font-medium">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Acceso Seguro</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Palmtree className="w-4 h-4 text-[#f64d0b]" />
              <span>Tus Viajes</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Compass className="w-4 h-4 text-sky-600" />
              <span>Asistencia 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full max-w-md mx-auto text-center pb-2">
        <p className="text-xs text-stone-600 font-medium">
          Soleando DR · Especialistas en viajes por República Dominicana © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  )
}
