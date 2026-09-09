import type { Metadata } from 'next'
import { requireUser } from '@/lib/auth-session'
import { AccountNavigation } from '@/components/account/account-navigation'
import { TravelerForm } from '@/components/account/traveler-form'
import { UserPlus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nuevo Viajero | Soleando DR',
  description: 'Agrega un nuevo viajero frecuente a tu cuenta de Soleando DR.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function NewTravelerPage() {
  await requireUser('/cuenta/viajeros/nuevo')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <AccountNavigation />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ede8e1] shadow-xs">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Agregar Nuevo Viajero
            </h1>
            <p className="text-xs text-stone-500">
              Registra los datos de un acompañante para seleccionarlo en futuras reservas.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <TravelerForm />
        </div>
      </div>
    </div>
  )
}
