import type { Metadata } from 'next'
import { requireUser } from '@/lib/auth-session'
import { getProfile } from '@/features/profile/queries'
import { AccountNavigation } from '@/components/account/account-navigation'
import { ProfileForm } from '@/components/account/profile-form'
import { UserCheck, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mi Perfil | Soleando DR',
  description: 'Gestiona tu información personal y datos de contacto en Soleando DR.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await requireUser('/cuenta/perfil')
  const profile = await getProfile(user.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <AccountNavigation />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ede8e1] shadow-xs">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Información de Mi Perfil
            </h1>
            <p className="text-xs text-stone-500">
              Datos personales del titular de la cuenta para agilizar tus futuras reservas.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ProfileForm
            initialProfile={profile}
            userEmail={user.email}
            defaultName={user.name}
          />
        </div>
      </div>
    </div>
  )
}
