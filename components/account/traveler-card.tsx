import Link from 'next/link'
import { type Traveler } from '@/lib/db/schema'
import { getCountryName } from '@/data/countries'
import { DeleteTravelerButton } from './delete-traveler-button'
import { User, Calendar, Globe, Edit2 } from 'lucide-react'

interface TravelerCardProps {
  traveler: Traveler
}

export function TravelerCard({ traveler }: TravelerCardProps) {
  const fullName = `${traveler.firstName} ${traveler.lastName}`

  // Format date of birth safely
  let formattedDob = ''
  if (traveler.dateOfBirth) {
    try {
      const [year, month, day] = traveler.dateOfBirth.split('-').map(Number)
      if (year && month && day) {
        const dateObj = new Date(year, month - 1, day)
        formattedDob = new Intl.DateTimeFormat('es-DO', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(dateObj)
      }
    } catch {
      formattedDob = traveler.dateOfBirth
    }
  }

  const countryName = getCountryName(traveler.nationalityCode)

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ede8e1] shadow-xs hover:border-orange-200 hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f64d0b] font-bold text-lg shrink-0">
              {traveler.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                {fullName}
              </h3>
              <p className="text-xs text-stone-400 font-medium">Viajero guardado</p>
            </div>
          </div>
        </div>

        {/* Optional Traveler Details */}
        <div className="space-y-2 mt-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
          {formattedDob && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>
                Nacimiento: <strong className="text-stone-800">{formattedDob}</strong>
              </span>
            </div>
          )}

          {countryName && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>
                Nacionalidad: <strong className="text-stone-800">{countryName}</strong>
              </span>
            </div>
          )}

          {!formattedDob && !countryName && (
            <p className="text-stone-400 italic text-[11px]">
              Solo nombre registrado. Puedes completar su fecha de nacimiento y nacionalidad al editar.
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 mt-4 border-t border-[#ede8e1] flex items-center justify-between">
        <Link
          href={`/cuenta/viajeros/${traveler.id}/editar`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-[#f64d0b] hover:bg-orange-50 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Editar</span>
        </Link>

        <DeleteTravelerButton travelerId={traveler.id} travelerName={fullName} />
      </div>
    </div>
  )
}
