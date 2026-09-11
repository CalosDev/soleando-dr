import 'server-only'

import { and, asc, eq, inArray } from 'drizzle-orm'

import { db } from '@/lib/db'
import { catalogItems } from '@/lib/db/schema'
import type { Cruise, Experience } from '@/features/catalog/types'

export type CatalogKind =
  | 'tour'
  | 'excursion_national'
  | 'excursion_international'
  | 'cruise'

function isCatalogRecord(value: unknown): value is { id: string; slug?: string } {
  return typeof value === 'object' && value !== null && typeof (value as { id?: unknown }).id === 'string'
}

async function getCatalogItems<T extends { id: string }>(
  kinds: readonly CatalogKind[],
): Promise<T[]> {
  if (!db) return []

  try {
    const rows = await db
      .select({ content: catalogItems.content })
      .from(catalogItems)
      .where(and(inArray(catalogItems.kind, [...kinds]), eq(catalogItems.status, 'published')))
      .orderBy(asc(catalogItems.sortOrder), asc(catalogItems.createdAt))

    return rows.map((row) => row.content).filter(isCatalogRecord) as T[]
  } catch {
    return []
  }
}

export function getExperiences(): Promise<Experience[]> {
  return getCatalogItems(['tour', 'excursion_national', 'excursion_international'])
}

export function getCruises(): Promise<Cruise[]> {
  return getCatalogItems(['cruise'])
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const experiences = await getExperiences()
  return experiences.find((experience) => experience.slug === slug || experience.id === slug) ?? null
}

export async function getCruiseById(id: string): Promise<Cruise | null> {
  const cruises = await getCruises()
  return cruises.find((cruise) => cruise.id === id) ?? null
}
