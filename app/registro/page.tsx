import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-session'
import { RegisterForm } from '@/components/auth/register-form'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Crear cuenta | Soleando DR',
  description: 'Regístrate en Soleando DR para acceder a ofertas exclusivas y gestionar tus reservas de viajes.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/cuenta')
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Soleando</span>
        </Link>

        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
              alt="Soleando Logo"
              width={160}
              height={48}
              className="h-11 w-auto mx-auto object-contain"
              priority
            />
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-stone-900">
            Crea tu cuenta de viajero
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Únete a Soleando y organiza tus vacaciones sin complicaciones
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-stone-200/50 rounded-3xl border border-[#ede8e1] sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
