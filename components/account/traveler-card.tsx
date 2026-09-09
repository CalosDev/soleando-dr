import Link from 'next/link'
import { DeleteTravelerButton } from '@/components/account/delete-traveler-button'
import type { Traveler } from '@/lib/db/schema'

function formatDate(dateOfBirth: string) {
  return new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${dateOfBirth}T00:00:00.000Z`))
}

export function TravelerCard({ traveler }: { traveler: Traveler }) {
  const fullName = `${traveler.firstName} ${traveler.lastName}`
  return <article className="traveler-card">
    <div><h2>{fullName}</h2>{traveler.dateOfBirth && <p>Nacimiento: {formatDate(traveler.dateOfBirth)}</p>}{traveler.nationalityCode && <p>Nacionalidad: {traveler.nationalityCode}</p>}</div>
    <div className="traveler-card-actions"><Link href={`/cuenta/viajeros/${traveler.id}/editar`}>Editar</Link><DeleteTravelerButton id={traveler.id} name={fullName} /></div>
  </article>
}
