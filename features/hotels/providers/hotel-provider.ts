import type { HotelAvailability, HotelDetails, HotelRate, HotelReference, HotelSearchInput, HotelSearchResult } from '@/features/hotels/domain/types'

export interface HotelProvider {
  readonly name: 'mock'
  listFeaturedHotels(): Promise<HotelSearchResult[]>
  searchHotels(input: HotelSearchInput): Promise<HotelSearchResult[]>
  getHotelDetails(reference: HotelReference): Promise<HotelDetails>
  getAvailability(reference: HotelReference, input: HotelSearchInput): Promise<HotelAvailability>
  checkRate(rateKey: string): Promise<HotelRate>
}
