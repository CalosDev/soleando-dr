import 'server-only'

import { HotelProviderUnavailableError } from '@/features/hotels/domain/errors'
import type { HotelAvailability, HotelDetails, HotelRate, HotelReference, HotelSearchInput, HotelSearchResult } from '@/features/hotels/domain/types'
import type { HotelProvider } from '@/features/hotels/providers/hotel-provider'

export class UnavailableHotelProvider implements HotelProvider {
  readonly name = 'mock' as const

  async listFeaturedHotels(): Promise<HotelSearchResult[]> { throw new HotelProviderUnavailableError() }
  async searchHotels(_input: HotelSearchInput): Promise<HotelSearchResult[]> { throw new HotelProviderUnavailableError() }
  async getHotelDetails(_reference: HotelReference): Promise<HotelDetails> { throw new HotelProviderUnavailableError() }
  async getAvailability(_reference: HotelReference, _input: HotelSearchInput): Promise<HotelAvailability> { throw new HotelProviderUnavailableError() }
  async checkRate(_rateKey: string): Promise<HotelRate> { throw new HotelProviderUnavailableError() }
}
