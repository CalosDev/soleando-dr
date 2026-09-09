'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-session'
import { requireDatabase } from '@/lib/db'
import { travelers } from '@/lib/db/schema'
import { travelerIdSchema, travelerSchema } from '@/features/travelers/schemas'

export type TravelerActionResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export async function createTravelerAction(input: unknown): Promise<TravelerActionResult> {
  const user = await requireUser()
  const parsed = travelerSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Revisa los campos indicados.', fieldErrors: parsed.error.flatten().fieldErrors }

  try {
    const now = new Date()
    await requireDatabase().insert(travelers).values({
      id: crypto.randomUUID(),
      userId: user.id,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      dateOfBirth: parsed.data.dateOfBirth ?? null,
      nationalityCode: parsed.data.nationalityCode ?? null,
      createdAt: now,
      updatedAt: now,
    })
  } catch {
    return { ok: false, error: 'No pudimos guardar el viajero. Inténtalo nuevamente.' }
  }

  revalidatePath('/cuenta')
  revalidatePath('/cuenta/viajeros')
  return { ok: true }
}

export async function updateTravelerAction(id: string, input: unknown): Promise<TravelerActionResult> {
  const user = await requireUser()
  if (!travelerIdSchema.safeParse(id).success) return { ok: false, error: 'No pudimos encontrar el viajero.' }
  const parsed = travelerSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Revisa los campos indicados.', fieldErrors: parsed.error.flatten().fieldErrors }

  try {
    const updated = await requireDatabase().update(travelers).set({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      dateOfBirth: parsed.data.dateOfBirth ?? null,
      nationalityCode: parsed.data.nationalityCode ?? null,
      updatedAt: new Date(),
    }).where(and(eq(travelers.id, id), eq(travelers.userId, user.id))).returning({ id: travelers.id })
    if (!updated.length) return { ok: false, error: 'No pudimos encontrar el viajero.' }
  } catch {
    return { ok: false, error: 'No pudimos guardar el viajero. Inténtalo nuevamente.' }
  }

  revalidatePath('/cuenta')
  revalidatePath('/cuenta/viajeros')
  revalidatePath(`/cuenta/viajeros/${id}/editar`)
  return { ok: true }
}

export async function deleteTravelerAction(id: string): Promise<TravelerActionResult> {
  const user = await requireUser()
  if (!travelerIdSchema.safeParse(id).success) return { ok: false, error: 'No pudimos encontrar el viajero.' }

  try {
    const deleted = await requireDatabase().delete(travelers).where(and(eq(travelers.id, id), eq(travelers.userId, user.id))).returning({ id: travelers.id })
    if (!deleted.length) return { ok: false, error: 'No pudimos encontrar el viajero.' }
  } catch {
    return { ok: false, error: 'No pudimos eliminar el viajero. Inténtalo nuevamente.' }
  }

  revalidatePath('/cuenta')
  revalidatePath('/cuenta/viajeros')
  return { ok: true }
}
