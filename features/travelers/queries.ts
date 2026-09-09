import 'server-only'

import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { travelers } from '@/lib/db/schema'

export async function getTravelers(userId: string) {
  if (!db) return []
  return db.select().from(travelers).where(eq(travelers.userId, userId)).orderBy(asc(travelers.createdAt))
}

export async function getTravelerForUser(id: string, userId: string) {
  if (!db) return null
  const [traveler] = await db.select().from(travelers).where(and(eq(travelers.id, id), eq(travelers.userId, userId)))
  return traveler ?? null
}
