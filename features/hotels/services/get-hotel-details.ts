import 'server-only'

import { getHotelProvider } from '../providers/get-hotel-provider'
import { type HotelReference, type HotelDetails } from '../domain/types'
import { HotelProviderError } from '../domain/errors'

export async function getHotelDetails(reference: HotelReference): Promise<HotelDetails | null> {
  if (!reference || !reference.id) {
    return null
  }

  const provider = getHotelProvider()

  try {
    const details = await provider.getHotelDetails(reference)
    return details
  } catch (error) {
    if (error instanceof HotelProviderError) {
      throw error
    }
    throw new HotelProviderError('Ocurrió un error al consultar los detalles del hotel.', {
      provider: provider.name,
      cause: error,
    })
  }
}
