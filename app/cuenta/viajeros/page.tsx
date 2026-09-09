import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/auth-session'
import { getTravelers } from '@/features/travelers/queries'
import { AccountNavigation } from '@/components/account/account-navigation'
import { TravelerCard } from '@/components/account/traveler-card'
import { Users, UserPlus, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mis Viajeros | Soleando DR',
  description: 'Gestiona a tus acompañantes y viajeros frecuentes en Soleando DR.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function TravelersPage() {
  const user = await requireUser('/cuenta/viajeros')
  const travelersList = await getTravelers(user.id)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <AccountNavigation />

      {/* Header with Title and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Mis Viajeros
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-[#f64d0b]">
              {travelersList.length} {travelersList.length === 1 ? 'guardado' : 'guardados'}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            Guarda los datos de tus acompañantes habituales para asignarlos rápidamente en futuras reservas.
          </p>
        </div>

        <Link
          href="/cuenta/viajeros/nuevo"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Agregar viajero</span>
        </Link>
      </div>

      {/* Content: Empty State or Grid */}
      {travelersList.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#ede8e1] shadow-xs text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#f64d0b] flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Aún no tienes viajeros guardados
          </h2>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            Registra a las personas con las que sueles vacacionar (familiares, amigos o pareja) y no tendrás que volver a escribir sus nombres en cada reserva.
          </p>
          <Link
            href="/cuenta/viajeros/nuevo"
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Agregar primer viajero</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {travelersList.map((traveler) => (
            <TravelerCard key={traveler.id} traveler={traveler} />
          ))}
        </div>
      )}
    </div>
  )
}
