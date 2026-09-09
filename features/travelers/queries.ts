import { db } from '@/lib/db'
import { travelers, type Traveler } from '@/lib/db/schema'
import { and, asc, eq } from 'drizzle-orm'

// In-memory store for demo / offline development fallback
const inMemoryTravelers = new Map<string, Traveler>()

export async function getTravelers(userId: string): Promise<Traveler[]> {
  if (!userId) return []

  if (!db) {
    return Array.from(inMemoryTravelers.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  try {
    const res = await db
      .select()
      .from(travelers)
      .where(eq(travelers.userId, userId))
      .orderBy(asc(travelers.createdAt))
    return res || []
  } catch {
    return Array.from(inMemoryTravelers.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }
}

export async function getTravelerById({
  id,
  userId,
}: {
  id: string
  userId: string
}): Promise<Traveler | null> {
  if (!id || !userId) return null

  if (!db) {
    const item = inMemoryTravelers.get(id)
    if (item && item.userId === userId) {
      return item
    }
    return null
  }

  try {
    const res = await db
      .select()
      .from(travelers)
      .where(and(eq(travelers.id, id), eq(travelers.userId, userId)))
      .limit(1)

    if (res && res.length > 0) {
      return res[0]
    }
  } catch {
    const item = inMemoryTravelers.get(id)
    if (item && item.userId === userId) {
      return item
    }
  }

  return null
}

export function saveInMemoryTraveler(traveler: Traveler): void {
  inMemoryTravelers.set(traveler.id, traveler)
}

export function deleteInMemoryTraveler(id: string, userId: string): boolean {
  const item = inMemoryTravelers.get(id)
  if (item && item.userId === userId) {
    inMemoryTravelers.delete(id)
    return true
  }
  return false
}
