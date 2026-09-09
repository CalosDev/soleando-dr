'use server'

import { requireUser } from '@/lib/auth-session'
import { db } from '@/lib/db'
import { travelers, type Traveler } from '@/lib/db/schema'
import { travelerSchema, type TravelerInput } from './schemas'
import { and, eq } from 'drizzle-orm'
import { saveInMemoryTraveler, deleteInMemoryTraveler, getTravelerById } from './queries'
import { revalidatePath } from 'next/cache'

export interface ActionResponse {
  success: boolean
  error?: string
}

export async function createTravelerAction(rawInput: TravelerInput): Promise<ActionResponse> {
  const user = await requireUser('/cuenta/viajeros/nuevo')

  const parsed = travelerSchema.safeParse(rawInput)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Revisa los campos indicados.'
    return { success: false, error: firstIssue }
  }

  const { firstName, lastName, dateOfBirth, nationalityCode } = parsed.data
  const id = crypto.randomUUID()
  const now = new Date()

  if (!db) {
    saveInMemoryTraveler({
      id,
      userId: user.id,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ?? null,
      nationalityCode: nationalityCode ?? null,
      createdAt: now,
      updatedAt: now,
    })
    revalidatePath('/cuenta')
    revalidatePath('/cuenta/viajeros')
    return { success: true }
  }

  try {
    await db.insert(travelers).values({
      id,
      userId: user.id,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ?? null,
      nationalityCode: nationalityCode ?? null,
      createdAt: now,
      updatedAt: now,
    })

    revalidatePath('/cuenta')
    revalidatePath('/cuenta/viajeros')
    return { success: true }
  } catch {
    return { success: false, error: 'No pudimos guardar el viajero. Inténtalo de nuevo.' }
  }
}

export async function updateTravelerAction(
  id: string,
  rawInput: TravelerInput
): Promise<ActionResponse> {
  const user = await requireUser('/cuenta/viajeros')

  if (!id || typeof id !== 'string') {
    return { success: false, error: 'Identificador de viajero inválido.' }
  }

  const parsed = travelerSchema.safeParse(rawInput)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Revisa los campos indicados.'
    return { success: false, error: firstIssue }
  }

  const { firstName, lastName, dateOfBirth, nationalityCode } = parsed.data
  const now = new Date()

  if (!db) {
    const existing = await getTravelerById({ id, userId: user.id })
    if (!existing) {
      return { success: false, error: 'Viajero no encontrado.' }
    }
    saveInMemoryTraveler({
      ...existing,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ?? null,
      nationalityCode: nationalityCode ?? null,
      updatedAt: now,
    })
    revalidatePath('/cuenta')
    revalidatePath('/cuenta/viajeros')
    return { success: true }
  }

  try {
    // Atomic update strictly verifying ownership
    const updatedRows = await db
      .update(travelers)
      .set({
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ?? null,
        nationalityCode: nationalityCode ?? null,
        updatedAt: now,
      })
      .where(and(eq(travelers.id, id), eq(travelers.userId, user.id)))
      .returning({ id: travelers.id })

    if (!updatedRows || updatedRows.length === 0) {
      return { success: false, error: 'Viajero no encontrado.' }
    }

    revalidatePath('/cuenta')
    revalidatePath('/cuenta/viajeros')
    return { success: true }
  } catch {
    return { success: false, error: 'No pudimos actualizar los datos del viajero.' }
  }
}

export async function deleteTravelerAction(id: string): Promise<ActionResponse> {
  const user = await requireUser('/cuenta/viajeros')

  if (!id || typeof id !== 'string') {
    return { success: false, error: 'Identificador inválido.' }
  }

  if (!db) {
    const deleted = deleteInMemoryTraveler(id, user.id)
    if (!deleted) {
      return { success: false, error: 'Viajero no encontrado.' }
    }
    revalidatePath('/cuenta')
    revalidatePath('/cuenta/viajeros')
    return { success: true }
  }

  try {
    // Atomic delete strictly verifying ownership
    const deletedRows = await db
      .delete(travelers)
      .where(and(eq(travelers.id, id), eq(travelers.userId, user.id)))
      .returning({ id: travelers.id })

    if (!deletedRows || deletedRows.length === 0) {
      return { success: false, error: 'Viajero no encontrado.' }
    }

    revalidatePath('/cuenta')
    revalidatePath('/cuenta/viajeros')
    return { success: true }
  } catch {
    return { success: false, error: 'No pudimos eliminar el viajero. Inténtalo más tarde.' }
  }
}
