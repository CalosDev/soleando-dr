import { notFound } from 'next/navigation'
import { TravelerForm } from '@/components/account/traveler-form'
import { getTravelerForUser } from '@/features/travelers/queries'
import { travelerIdSchema } from '@/features/travelers/schemas'
import { requireUser } from '@/lib/auth-session'

type EditTravelerPageProps = { params: Promise<{ id: string }> }

export default async function EditTravelerPage({ params }: EditTravelerPageProps) {
  const user = await requireUser('/cuenta/viajeros')
  const { id } = await params
  if (!travelerIdSchema.safeParse(id).success) notFound()
  const traveler = await getTravelerForUser(id, user.id)
  if (!traveler) notFound()

  return <main className="account-content-page"><section className="account-content-card" aria-labelledby="edit-traveler-title"><p className="eyebrow">Mis viajeros</p><h1 id="edit-traveler-title">Editar <em>viajero.</em></h1><p>Actualiza la información guardada de {traveler.firstName}.</p><TravelerForm traveler={traveler} /></section></main>
}
