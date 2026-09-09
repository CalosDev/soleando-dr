import 'server-only'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'

export async function getProfile(userId: string) {
  if (!db) return null
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId))
  return profile ?? null
}
