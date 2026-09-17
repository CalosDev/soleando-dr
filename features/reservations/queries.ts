import { desc, eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { reservations, type Reservation } from '@/lib/db/schema'

export async function getReservationsForUser(userId: string): Promise<Reservation[]> {
  if (!db || !userId) return []
  try {
    return await db.select().from(reservations)
      .where(eq(reservations.userId, userId))
      .orderBy(desc(reservations.startsOn), desc(reservations.createdAt))
  } catch {
    return []
  }
}
