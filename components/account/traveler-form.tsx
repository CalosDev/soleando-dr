'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type Traveler } from '@/lib/db/schema'
import { createTravelerAction, updateTravelerAction } from '@/features/travelers/actions'
import { COUNTRIES } from '@/data/countries'
import { User, Calendar, Globe, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'

interface TravelerFormProps {
  initialTraveler?: Traveler | null
}

export function TravelerForm({ initialTraveler }: TravelerFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialTraveler)

  const [firstName, setFirstName] = useState(initialTraveler?.firstName || '')
  const [lastName, setLastName] = useState(initialTraveler?.lastName || '')
  const [dateOfBirth, setDateOfBirth] = useState(initialTraveler?.dateOfBirth || '')
  const [nationalityCode, setNationalityCode] = useState(initialTraveler?.nationalityCode || '')

  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Maximum allowed date is today
  const todayStr = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)

    startTransition(async () => {
      const payload = {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth || null,
        nationalityCode: nationalityCode || null,
      }

      const res = isEditing && initialTraveler
        ? await updateTravelerAction(initialTraveler.id, payload)
        : await createTravelerAction(payload)

      if (!res.success) {
        setErrorMessage(res.error || 'No se pudo guardar el viajero.')
      } else {
        router.push('/cuenta/viajeros')
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="traveler-first-name"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Nombre <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="traveler-first-name"
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ej. Ana"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="traveler-last-name"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Apellido(s) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="traveler-last-name"
              type="text"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ej. Pérez"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Date of Birth and Nationality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="traveler-dob"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700"
            >
              Fecha de nacimiento
            </label>
            <span className="text-[11px] text-stone-400 font-medium">(Opcional)</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="traveler-dob"
              type="date"
              max={todayStr}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all"
            />
          </div>
          <p className="mt-1 text-[11px] text-stone-400">
            Requerida por hoteles para aplicar tarifas de adultos o menores.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="traveler-nationality"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700"
            >
              Nacionalidad
            </label>
            <span className="text-[11px] text-stone-400 font-medium">(Opcional)</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Globe className="w-4 h-4" />
            </div>
            <select
              id="traveler-nationality"
              value={nationalityCode}
              onChange={(e) => setNationalityCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ede8e1] bg-white text-stone-900 text-sm focus:outline-hidden focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 transition-all cursor-pointer"
            >
              <option value="">Selecciona nacionalidad</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#ede8e1] flex items-center justify-between">
        <Link
          href="/cuenta/viajeros"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a viajeros</span>
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#f64d0b] hover:bg-[#e04408] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEditing ? 'Actualizando…' : 'Guardando…'}</span>
            </>
          ) : (
            <span>{isEditing ? 'Guardar cambios' : 'Agregar viajero'}</span>
          )}
        </button>
      </div>
    </form>
  )
}
