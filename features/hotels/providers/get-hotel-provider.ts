import 'server-only'

import { type HotelProvider } from './hotel-provider'
import { MockHotelProvider } from './mock/mock-hotel-provider'
import {
  type HotelSearchInput,
  type HotelSearchResult,
  type HotelReference,
  type HotelDetails,
  type HotelAvailability,
  type HotelRate,
} from '../domain/types'
import { HotelProviderUnavailableError } from '../domain/errors'

/**
 * Fallback provider used in production when no live hotel supplier credentials are configured.
 * Implements a strict fail-closed policy: never serves mock availability to real users.
 */
export class UnavailableHotelProvider implements HotelProvider {
  readonly name = 'unavailable'

  async searchHotels(_input: HotelSearchInput): Promise<HotelSearchResult[]> {
    throw new HotelProviderUnavailableError(
      'El motor de búsqueda de hoteles no está disponible en producción actualmente. Por favor contáctanos por WhatsApp.'
    )
  }

  async getHotelDetails(_reference: HotelReference): Promise<HotelDetails | null> {
    throw new HotelProviderUnavailableError()
  }

  async getAvailability(_reference: HotelReference, _input: HotelSearchInput): Promise<HotelAvailability> {
    throw new HotelProviderUnavailableError()
  }

  async checkRate(_rateKey: string): Promise<HotelRate> {
    throw new HotelProviderUnavailableError()
  }
}

// Singleton instances
let mockProviderInstance: MockHotelProvider | null = null
let unavailableProviderInstance: UnavailableHotelProvider | null = null

/**
 * Factory that resolves the active HotelProvider implementation according to environment configuration.
 */
export function getHotelProvider(): HotelProvider {
  const configuredProvider = (process.env.HOTEL_PROVIDER || 'mock').toLowerCase()
  const isProduction = process.env.NODE_ENV === 'production'

  // Production guard: fail closed if mock provider is requested in production
  if (isProduction && configuredProvider === 'mock') {
    if (!unavailableProviderInstance) {
      unavailableProviderInstance = new UnavailableHotelProvider()
    }
    return unavailableProviderInstance
  }

  switch (configuredProvider) {
    case 'mock':
    default:
      if (!mockProviderInstance) {
        mockProviderInstance = new MockHotelProvider()
      }
      return mockProviderInstance
  }
}
