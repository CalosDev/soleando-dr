import 'server-only'

import { HotelSearchValidationError } from '@/features/hotels/domain/errors'
import type { HotelReference } from '@/features/hotels/domain/types'
import { getHotelProvider } from '@/features/hotels/providers/get-hotel-provider'
import { hotelSearchInputSchema } from '@/features/hotels/schemas/hotel-search'

export async function getFeaturedHotels() {
  return getHotelProvider().listFeaturedHotels()
}

export async function searchHotels(input: unknown) {
  const parsed = hotelSearchInputSchema.safeParse(input)
  if (!parsed.success) throw new HotelSearchValidationError(parsed.error.issues[0]?.message)
  return getHotelProvider().searchHotels(parsed.data)
}

export async function getHotelDetails(reference: HotelReference) {
  return getHotelProvider().getHotelDetails(reference)
}

export async function getHotelAvailability(reference: HotelReference, input: unknown) {
  const parsed = hotelSearchInputSchema.safeParse(input)
  if (!parsed.success) throw new HotelSearchValidationError(parsed.error.issues[0]?.message)
  return getHotelProvider().getAvailability(reference, parsed.data)
}

export async function checkHotelRate(rateKey: string) {
  return getHotelProvider().checkRate(rateKey)
}
