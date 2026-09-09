'use server'

import { requireUser } from '@/lib/auth-session'
import { db } from '@/lib/db'
import { profiles, type Profile } from '@/lib/db/schema'
import { profileSchema, type ProfileInput } from './schemas'
import { saveInMemoryProfile } from './queries'
import { revalidatePath } from 'next/cache'

export interface ActionResponse {
  success: boolean
  error?: string
}

export async function updateProfileAction(rawInput: ProfileInput): Promise<ActionResponse> {
  const user = await requireUser('/cuenta/perfil')

  const parsed = profileSchema.safeParse(rawInput)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Revisa los campos indicados.'
    return { success: false, error: firstIssue }
  }

  const { firstName, lastName, phone, countryCode } = parsed.data

  const now = new Date()

  if (!db) {
    // Demo / offline fallback
    saveInMemoryProfile({
      userId: user.id,
      firstName,
      lastName,
      phone: phone ?? null,
      countryCode: countryCode ?? null,
      createdAt: now,
      updatedAt: now,
    })
    revalidatePath('/cuenta')
    revalidatePath('/cuenta/perfil')
    return { success: true }
  }

  try {
    await db
      .insert(profiles)
      .values({
        userId: user.id,
        firstName,
        lastName,
        phone: phone ?? null,
        countryCode: countryCode ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          firstName,
          lastName,
          phone: phone ?? null,
          countryCode: countryCode ?? null,
          updatedAt: now,
        },
      })

    revalidatePath('/cuenta')
    revalidatePath('/cuenta/perfil')
    return { success: true }
  } catch (err) {
    // Fail safely without exposing database credentials or stack trace
    return { success: false, error: 'No pudimos guardar tus datos. Inténtalo nuevamente.' }
  }
}
