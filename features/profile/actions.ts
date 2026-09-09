'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-session'
import { requireDatabase } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { profileSchema } from '@/features/profile/schemas'

export type ProfileActionResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export async function updateProfileAction(input: unknown): Promise<ProfileActionResult> {
  const user = await requireUser()
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Revisa los campos indicados.', fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const now = new Date()
  try {
    await requireDatabase().insert(profiles).values({
      userId: user.id,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone ?? null,
      countryCode: parsed.data.countryCode ?? null,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoUpdate({
      target: profiles.userId,
      set: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone ?? null,
        countryCode: parsed.data.countryCode ?? null,
        updatedAt: now,
      },
    })
  } catch {
    return { ok: false, error: 'No pudimos guardar tus datos. Inténtalo nuevamente.' }
  }

  revalidatePath('/cuenta')
  revalidatePath('/cuenta/perfil')
  return { ok: true }
}
