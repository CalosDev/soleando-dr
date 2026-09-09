import 'server-only'

import { getHotelProvider } from '../providers/get-hotel-provider'
import { type HotelRate } from '../domain/types'
import { HotelProviderError, HotelRateUnavailableError } from '../domain/errors'

export async function checkHotelRate(rateKey: string): Promise<HotelRate> {
  if (!rateKey || typeof rateKey !== 'string') {
    throw new HotelRateUnavailableError('invalid-key')
  }

  const provider = getHotelProvider()

  try {
    return await provider.checkRate(rateKey)
  } catch (error) {
    if (error instanceof HotelProviderError) {
      throw error
    }
    throw new HotelProviderError('No fue posible revalidar la tarifa.', {
      provider: provider.name,
      cause: error,
    })
  }
}
