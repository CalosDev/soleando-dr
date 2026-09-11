import 'server-only'

import { and, asc, eq, inArray } from 'drizzle-orm'

import { db } from '@/lib/db'
import { catalogItems } from '@/lib/db/schema'
import type { Cruise, Experience, ExperienceScope } from '@/features/catalog/types'

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
  return getScopedExperiences()
}

function getExperienceScope(kind: CatalogKind): ExperienceScope {
  switch (kind) {
    case 'excursion_national':
      return 'national'
    case 'excursion_international':
      return 'international'
    case 'tour':
      return 'package'
    default:
      return 'package'
  }
}

async function getScopedExperiences(): Promise<Experience[]> {
  if (!db) return []

  try {
    const kinds: CatalogKind[] = ['tour', 'excursion_national', 'excursion_international']
    const rows = await db
      .select({ content: catalogItems.content, kind: catalogItems.kind })
      .from(catalogItems)
      .where(and(inArray(catalogItems.kind, kinds), eq(catalogItems.status, 'published')))
      .orderBy(asc(catalogItems.sortOrder), asc(catalogItems.createdAt))

    return rows
      .filter((row) => isCatalogRecord(row.content))
      .map((row) => ({
        ...(row.content as Experience),
        scope: getExperienceScope(row.kind as CatalogKind),
      }))
  } catch {
    return []
  }
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
