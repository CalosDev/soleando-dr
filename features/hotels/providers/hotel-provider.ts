import 'server-only'

import {
  type HotelSearchInput,
  type HotelSearchResult,
  type HotelReference,
  type HotelDetails,
  type HotelAvailability,
  type HotelRate,
} from '../domain/types'

/**
 * Standard contract that every hotel supplier adapter must implement.
 * Isolates the Soleando travel domain from third-party vendor DTOs.
 */
export interface HotelProvider {
  /**
   * Technical identifier of the provider (e.g., 'mock', 'hotelbeds', 'expedia').
   */
  readonly name: string

  /**
   * Searches properties matching destination and travel parameters.
   */
  searchHotels(input: HotelSearchInput): Promise<HotelSearchResult[]>

  /**
   * Retrieves full technical details and media for a specific property reference.
   */
  getHotelDetails(reference: HotelReference): Promise<HotelDetails | null>

  /**
   * Checks real-time room availability and rates for given dates and occupancy.
   */
  getAvailability(
    reference: HotelReference,
    input: HotelSearchInput
  ): Promise<HotelAvailability>

  /**
   * Revalidates an opaque rate key prior to checkout.
   */
  checkRate(rateKey: string): Promise<HotelRate>
}
