'use client'

import { useState, useTransition } from 'react'
import { type Profile } from '@/lib/db/schema'
import { updateProfileAction } from '@/features/profile/actions'
import { COUNTRIES } from '@/data/countries'
import { User, Phone, Globe, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface ProfileFormProps {
  initialProfile: Profile | null
  userEmail: string
  defaultName?: string
}

export function ProfileForm({ initialProfile, userEmail, defaultName = '' }: ProfileFormProps) {
  // Prepopulate names if profile doesn't exist yet
  const nameParts = defaultName.trim().split(' ')
  const defaultFirstName = initialProfile?.firstName || nameParts[0] || ''
  const defaultLastName = initialProfile?.lastName || nameParts.slice(1).join(' ') || ''

  const [firstName, setFirstName] = useState(defaultFirstName)
  const [lastName, setLastName] = useState(defaultLastName)
  const [phone, setPhone] = useState(initialProfile?.phone || '')
  const [countryCode, setCountryCode] = useState(initialProfile?.countryCode || 'DO')

  const [isPending, startTransition] = useTransition()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    startTransition(async () => {
      const res = await updateProfileAction({
        firstName,
        lastName,
        phone,
        countryCode,
      })

      if (!res.success) {
        setErrorMessage(res.error || 'No pudimos guardar los cambios.')
      } else {
        setSuccessMessage('¡Tu perfil ha sido actualizado correctamente!')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Account Email (Read-Only) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="profile-email"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700"
          >
            Correo electrónico
          </label>
          <span className="text-[11px] font-semibold text-stone-400">
            Identidad de cuenta (Solo lectura)
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="profile-email"
            type="email"
            disabled
            value={userEmail}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 text-sm cursor-not-allowed select-none font-medium"
          />
        </div>
      </div>

      {/* Name and Surname */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="profile-first-name"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Nombre <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="profile-first-name"
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ej. Carlos"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-last-name"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Apellido(s) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="profile-last-name"
              type="text"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ej. Feliciano"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Phone and Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="profile-phone"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Teléfono de contacto
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 809 555 0199"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-country"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            País de residencia
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Globe className="w-4 h-4" />
            </div>
            <select
              id="profile-country"
              autoComplete="country"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all cursor-pointer"
            >
              <option value="">Selecciona un país</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#ede8e1] flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando cambios…</span>
            </>
          ) : (
            <span>Guardar perfil</span>
          )}
        </button>
      </div>
    </form>
  )
}
