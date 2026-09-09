import 'server-only'

import { getHotelProvider } from '../providers/get-hotel-provider'
import { hotelSearchInputSchema } from '../schemas/hotel-search'
import { type HotelSearchInput, type HotelSearchResult } from '../domain/types'
import { HotelValidationError, HotelProviderError } from '../domain/errors'

export async function searchHotels(rawInput: HotelSearchInput): Promise<HotelSearchResult[]> {
  const validation = hotelSearchInputSchema.safeParse(rawInput)
  if (!validation.success) {
    const errorMsg = validation.error.issues[0]?.message || 'Parámetros de búsqueda inválidos.'
    throw new HotelValidationError(errorMsg)
  }

  const provider = getHotelProvider()

  try {
    const results = await provider.searchHotels(validation.data)
    return results
  } catch (error) {
    if (error instanceof HotelProviderError) {
      throw error
    }
    throw new HotelProviderError('Ocurrió un error al buscar hoteles.', {
      provider: provider.name,
      cause: error,
    })
  }
}
