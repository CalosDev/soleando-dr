import 'server-only'

import { MOCK_HOTEL_ENTITIES, type MockHotelEntity } from '../providers/mock/mock-hotels-dataset'

export async function getHotelBySlug(slug: string): Promise<MockHotelEntity | null> {
  if (!slug) return null

  const normalized = decodeURIComponent(slug).trim().toLowerCase()

  const found = MOCK_HOTEL_ENTITIES.find((entity) => {
    const detailSlug = entity.details.slug?.toLowerCase()
    const searchSlug = entity.searchResult.slug?.toLowerCase()
    const refId = entity.details.reference.id?.toLowerCase()
    return detailSlug === normalized || searchSlug === normalized || refId === normalized
  })

  return found || null
}

export function getAllHotelSlugs(): string[] {
  return MOCK_HOTEL_ENTITIES.map((entity) => entity.details.slug || entity.details.reference.id)
}
