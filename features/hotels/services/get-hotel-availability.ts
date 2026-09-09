import 'server-only'

import { getHotelProvider } from '../providers/get-hotel-provider'
import { hotelSearchInputSchema } from '../schemas/hotel-search'
import {
  type HotelReference,
  type HotelSearchInput,
  type HotelAvailability,
} from '../domain/types'
import { HotelValidationError, HotelProviderError } from '../domain/errors'

export async function getHotelAvailability(
  reference: HotelReference,
  input: HotelSearchInput
): Promise<HotelAvailability> {
  const validation = hotelSearchInputSchema.safeParse(input)
  if (!validation.success) {
    const errorMsg = validation.error.issues[0]?.message || 'Parámetros de búsqueda inválidos.'
    throw new HotelValidationError(errorMsg)
  }

  const provider = getHotelProvider()

  try {
    return await provider.getAvailability(reference, validation.data)
  } catch (error) {
    if (error instanceof HotelProviderError) {
      throw error
    }
    throw new HotelProviderError('Error al consultar disponibilidad de habitaciones.', {
      provider: provider.name,
      cause: error,
    })
  }
}
