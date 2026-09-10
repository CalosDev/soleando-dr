import 'server-only'

import { and, asc, eq } from 'drizzle-orm'

import { CRUISES_DATA, type Cruise } from '@/data/cruises'
import { POPULAR_DESTINATIONS, type Destination } from '@/data/destinations'
import { EXPERIENCES_DATA, type Experience } from '@/data/experiences'
import { MOCK_HOTELS, type MockHotel } from '@/data/mock-hotels'
import { db } from '@/lib/db'
import { catalogItems } from '@/lib/db/schema'

export type CatalogKind = 'destination' | 'experience' | 'cruise' | 'hotel'

function isCatalogRecord(value: unknown): value is { id: string; slug?: string } {
  return typeof value === 'object' && value !== null && typeof (value as { id?: unknown }).id === 'string'
}

async function getCatalogItems<T extends { id: string }>(
  kind: CatalogKind,
  fallback: readonly T[],
): Promise<T[]> {
  if (!db) return [...fallback]

  try {
    const rows = await db
      .select({ content: catalogItems.content })
      .from(catalogItems)
      .where(and(eq(catalogItems.kind, kind), eq(catalogItems.status, 'published')))
      .orderBy(asc(catalogItems.sortOrder), asc(catalogItems.createdAt))

    const items = rows.map((row) => row.content).filter(isCatalogRecord) as T[]
    return items.length > 0 ? items : [...fallback]
  } catch {
    // The public catalog remains available if the database is temporarily unavailable.
    return [...fallback]
  }
}

export function getDestinations(): Promise<Destination[]> {
  return getCatalogItems('destination', POPULAR_DESTINATIONS)
}

export function getExperiences(): Promise<Experience[]> {
  return getCatalogItems('experience', EXPERIENCES_DATA)
}

export function getCruises(): Promise<Cruise[]> {
  return getCatalogItems('cruise', CRUISES_DATA)
}

export function getFeaturedHotels(): Promise<MockHotel[]> {
  return getCatalogItems('hotel', MOCK_HOTELS)
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const experiences = await getExperiences()
  return experiences.find((experience) => experience.slug === slug || experience.id === slug) ?? null
}

export async function getCruiseById(id: string): Promise<Cruise | null> {
  const cruises = await getCruises()
  return cruises.find((cruise) => cruise.id === id) ?? null
}
