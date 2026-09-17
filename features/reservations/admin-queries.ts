import { desc, eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { reservations, user } from '@/lib/db/schema'

export async function getReservationCustomers() {
  if (!db) return []
  return db.select({ id: user.id, name: user.name, email: user.email }).from(user).orderBy(user.email)
}

export async function getAdminReservations() {
  if (!db) return []
  return db.select({ reservation: reservations, customerName: user.name, customerEmail: user.email })
    .from(reservations).innerJoin(user, eq(reservations.userId, user.id))
    .orderBy(desc(reservations.createdAt))
}
