import Link from 'next/link'
import { requireUser } from '@/lib/auth-session'
import { getProfile } from '@/features/profile/queries'
import { getTravelers } from '@/features/travelers/queries'
import { LogoutButton } from '@/components/auth/logout-button'
import { AccountNavigation } from '@/components/account/account-navigation'
import {
  User,
  Mail,
  Shield,
  Hotel,
  CalendarCheck,
  Users,
  ArrowRight,
  ExternalLink,
  Sparkles,
  UserCheck,
  AlertCircle,
  Plus,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CuentaPage() {
  const user = await requireUser('/cuenta')
  const [profile, travelersList] = await Promise.all([
    getProfile(user.id),
    getTravelers(user.id),
  ])

  const isProfileComplete = Boolean(profile?.firstName && profile?.lastName)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <AccountNavigation />

      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede8e1] shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#fff7ed] border border-[#ffedd5] flex items-center justify-center text-[#f64d0b] font-bold text-2xl shrink-0 shadow-xs">
            {profile?.firstName
              ? profile.firstName.charAt(0).toUpperCase()
              : user.name
              ? user.name.charAt(0).toUpperCase()
              : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Hola, {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user.name || 'Viajero'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                <Sparkles className="w-3 h-3" />
                {user.role === 'admin' ? 'Administrador' : 'Viajero Soleando'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500 mt-1">
              <Mail className="w-4 h-4 text-stone-400" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-900 text-white hover:bg-stone-800 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Panel Admin</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <LogoutButton className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Profile Completion Reminder (if incomplete) */}
      {!isProfileComplete && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f64d0b] text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Completa la información de tu perfil
              </h2>
              <p className="text-sm text-stone-600 mt-0.5">
                Guarda tus nombres oficiales y teléfono para agilizar el llenado de tus futuras reservas.
              </p>
            </div>
          </div>
          <Link
            href="/cuenta/perfil"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <span>Completar perfil</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Explorar Hoteles */}
        <div className="bg-white rounded-3xl p-6 border border-[#ede8e1] shadow-xs flex flex-col justify-between hover:border-orange-200 hover:shadow-md transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center mb-4">
              <Hotel className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 mb-1">Explorar Hoteles & Resorts</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Encuentra los mejores alojamientos todo incluido en Punta Cana, Bayahíbe, Samaná y más destinos.
            </p>
          </div>
          <Link
            href="/hoteles"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#f64d0b] hover:text-[#e04408] transition-colors"
          >
            <span>Buscar alojamiento</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Mis Viajeros Guardados (Active) */}
        <div className="bg-white rounded-3xl p-6 border border-[#ede8e1] shadow-xs flex flex-col justify-between hover:border-orange-200 hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-[#f64d0b]">
                {travelersList.length} {travelersList.length === 1 ? 'viajero' : 'viajeros'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 mb-1">Mis Viajeros Guardados</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              {travelersList.length > 0
                ? 'Gestiona la información y documentos de tus acompañantes habituales de viaje.'
                : 'Añade acompañantes para asignarlos automáticamente en tus próximas reservas.'}
            </p>
          </div>
          <Link
            href="/cuenta/viajeros"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#f64d0b] hover:text-[#e04408] transition-colors"
          >
            <span>{travelersList.length > 0 ? 'Gestionar viajeros' : 'Agregar viajero'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 3: Mis Reservas (Fase 6) */}
        <div className="bg-white rounded-3xl p-6 border border-[#ede8e1] shadow-xs flex flex-col justify-between opacity-90">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                Próximamente
              </span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 mb-1">Mis Reservas</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Consulta tus reservas activas, estados de confirmación y comprobantes de viaje.
            </p>
          </div>
          <p className="mt-6 text-xs text-stone-400 font-medium">
            Módulo disponible en la Fase 6 del sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
