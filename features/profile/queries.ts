import { db } from '@/lib/db'
import { profiles, type Profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// In-memory fallback for environments without a live PostgreSQL connection (e.g. demo mode)
const inMemoryProfiles = new Map<string, Profile>()

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!userId) return null

  if (!db) {
    return inMemoryProfiles.get(userId) || null
  }

  try {
    const res = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    if (res && res.length > 0) {
      return res[0]
    }
  } catch (err) {
    // Database connection failure fallback
    return inMemoryProfiles.get(userId) || null
  }

  return null
}

export function saveInMemoryProfile(profile: Profile): void {
  inMemoryProfiles.set(profile.userId, profile)
}
