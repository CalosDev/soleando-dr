import 'server-only'

import { MockHotelProvider } from '@/features/hotels/providers/mock/mock-hotel-provider'
import type { HotelProvider } from '@/features/hotels/providers/hotel-provider'
import { UnavailableHotelProvider } from '@/features/hotels/providers/unavailable-hotel-provider'

export function getHotelProvider(): HotelProvider {
  const configuredProvider = process.env.HOTEL_PROVIDER ?? 'mock'
  if (configuredProvider === 'mock' && process.env.NODE_ENV !== 'production') return new MockHotelProvider()
  return new UnavailableHotelProvider()
}
