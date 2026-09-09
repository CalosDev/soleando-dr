import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth-session'
import { getTravelerById } from '@/features/travelers/queries'
import { AccountNavigation } from '@/components/account/account-navigation'
import { TravelerForm } from '@/components/account/traveler-form'
import { Edit } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Editar Viajero | Soleando DR',
  description: 'Modifica los datos de tu viajero guardado en Soleando DR.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

interface EditTravelerPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTravelerPage({ params }: EditTravelerPageProps) {
  const { id } = await params
  const user = await requireUser('/cuenta/viajeros')

  const traveler = await getTravelerById({ id, userId: user.id })
  if (!traveler) {
    notFound()
  }

  const fullName = `${traveler.firstName} ${traveler.lastName}`

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <AccountNavigation />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ede8e1] shadow-xs">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center">
            <Edit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Editar Viajero: {fullName}
            </h1>
            <p className="text-xs text-stone-500">
              Actualiza el nombre, fecha de nacimiento o nacionalidad de este viajero.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <TravelerForm initialTraveler={traveler} />
        </div>
      </div>
    </div>
  )
}
