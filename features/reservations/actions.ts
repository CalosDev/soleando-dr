'use server'

import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { reservations, user } from '@/lib/db/schema'

const dateValue = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
const reservationSchema = z.object({
  userId: z.string().trim().min(1).max(255),
  kind: z.enum(['hotel', 'tour', 'excursion_national', 'excursion_international', 'cruise']),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  title: z.string().trim().min(2).max(160),
  destination: z.string().trim().min(2).max(120),
  startsOn: dateValue,
  endsOn: dateValue,
  travelerCount: z.coerce.number().int().min(1).max(30),
  provider: z.string().trim().max(80).optional(),
  providerReference: z.string().trim().max(120).optional(),
  totalAmount: z.coerce.number().nonnegative().max(99_999_999).optional(),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).optional(),
  customerNote: z.string().trim().max(1000).optional(),
}).refine((value) => !value.startsOn || !value.endsOn || value.endsOn >= value.startsOn, {
  message: 'La fecha final no puede ser anterior a la fecha inicial.', path: ['endsOn'],
})

async function requireAdminAction(): Promise<void> {
  const current = await auth?.api.getSession({ headers: await headers() })
  if (!current?.user || (current.user as { role?: string }).role !== 'admin') throw new Error('Unauthorized')
}

function formValues(formData: FormData) {
  return reservationSchema.parse({
    userId: formData.get('userId'), kind: formData.get('kind'), status: formData.get('status'),
    title: formData.get('title'), destination: formData.get('destination'),
    startsOn: formData.get('startsOn') || undefined, endsOn: formData.get('endsOn') || undefined,
    travelerCount: formData.get('travelerCount'), provider: formData.get('provider') || undefined,
    providerReference: formData.get('providerReference') || undefined,
    totalAmount: formData.get('totalAmount') || undefined, currency: formData.get('currency') || undefined,
    customerNote: formData.get('customerNote') || undefined,
  })
}

export async function createReservationAction(formData: FormData): Promise<void> {
  await requireAdminAction()
  if (!db) throw new Error('La base de datos no está disponible.')
  const values = formValues(formData)
  const [customer] = await db.select({ id: user.id }).from(user).where(eq(user.id, values.userId)).limit(1)
  if (!customer) throw new Error('El cliente seleccionado no existe.')

  await db.insert(reservations).values({
    id: crypto.randomUUID(), ...values,
    provider: values.provider || null, providerReference: values.providerReference || null,
    totalAmount: values.totalAmount?.toFixed(2) ?? null, currency: values.currency || null,
    customerNote: values.customerNote || null, startsOn: values.startsOn || null, endsOn: values.endsOn || null,
  })
  revalidatePath('/cuenta')
  revalidatePath('/cuenta/reservas')
  revalidatePath('/admin/reservas')
  redirect('/admin/reservas')
}

const statusSchema = z.enum(['pending', 'confirmed', 'cancelled', 'completed'])

export async function updateReservationStatusAction(id: string, formData: FormData): Promise<void> {
  await requireAdminAction()
  if (!db || !id) throw new Error('La reserva no está disponible.')
  const status = statusSchema.parse(formData.get('status'))
  const updated = await db.update(reservations)
    .set({ status, updatedAt: new Date() })
    .where(eq(reservations.id, id))
    .returning({ id: reservations.id, userId: reservations.userId })
  if (!updated[0]) throw new Error('La reserva no existe.')
  revalidatePath('/cuenta')
  revalidatePath('/cuenta/reservas')
  revalidatePath('/admin/reservas')
}
