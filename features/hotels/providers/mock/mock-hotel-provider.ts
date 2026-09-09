import 'server-only'

import { type HotelProvider } from '../hotel-provider'
import {
  type HotelSearchInput,
  type HotelSearchResult,
  type HotelReference,
  type HotelDetails,
  type HotelAvailability,
  type HotelRate,
  type AvailableRoom,
  type HotelRateSummary,
} from '../../domain/types'
import {
  HotelNotFoundError,
  HotelRateUnavailableError,
} from '../../domain/errors'
import { MOCK_HOTEL_ENTITIES, type MockHotelEntity } from './mock-hotels-dataset'

export class MockHotelProvider implements HotelProvider {
  readonly name = 'mock'

  async searchHotels(input: HotelSearchInput): Promise<HotelSearchResult[]> {
    const destQuery = input.destination.trim().toLowerCase()

    // Deterministic filter by destination
    const filtered = MOCK_HOTEL_ENTITIES.filter((entity) => {
      if (!destQuery || destQuery === 'all' || destQuery === 'republica dominicana' || destQuery === 'dominican republic') {
        return true
      }
      const hotelDest = entity.searchResult.destination.toLowerCase()
      const hotelDestSlug = (entity.searchResult.destinationSlug || '').toLowerCase()
      const hotelName = entity.searchResult.name.toLowerCase()

      return (
        hotelDest.includes(destQuery) ||
        hotelDestSlug.includes(destQuery) ||
        hotelName.includes(destQuery)
      )
    })

    // Deterministic sorting: higher stars first, then higher rating
    const sorted = [...filtered].sort((a, b) => {
      const starsDiff = (b.searchResult.stars || 0) - (a.searchResult.stars || 0)
      if (starsDiff !== 0) return starsDiff
      return (b.searchResult.rating || 0) - (a.searchResult.rating || 0)
    })

    return sorted.map((entity) => ({
      ...entity.searchResult,
      availabilityStatus: 'available' as const,
    }))
  }

  async getHotelDetails(reference: HotelReference): Promise<HotelDetails | null> {
    const found = MOCK_HOTEL_ENTITIES.find(
      (entity) => entity.details.reference.id === reference.id
    )
    return found ? found.details : null
  }

  async getAvailability(
    reference: HotelReference,
    input: HotelSearchInput
  ): Promise<HotelAvailability> {
    const found = MOCK_HOTEL_ENTITIES.find(
      (entity) => entity.details.reference.id === reference.id
    )

    if (!found) {
      throw new HotelNotFoundError(reference.id, { provider: this.name })
    }

    // Calculate nights difference deterministically
    const inDate = new Date(input.checkIn + 'T00:00:00')
    const outDate = new Date(input.checkOut + 'T00:00:00')
    const diffMs = outDate.getTime() - inDate.getTime()
    const nights = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)))
    const roomMultiplier = Math.max(1, input.rooms.length)

    // Calculate total price based on nights and rooms
    const scaledRooms: AvailableRoom[] = found.rooms.map((room) => ({
      ...room,
      rates: room.rates.map((rate) => {
        const basePerNight = parseFloat(rate.total.amount) || 200
        const totalAmount = (basePerNight * nights * roomMultiplier).toFixed(2)
        return {
          ...rate,
          total: {
            amount: totalAmount,
            currency: rate.total.currency,
          },
        }
      }),
    }))

    return {
      hotel: reference,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      rooms: scaledRooms,
    }
  }

  async checkRate(rateKey: string): Promise<HotelRate> {
    // Locate the rate across all mock entities
    let foundEntity: MockHotelEntity | undefined
    let foundRoom: AvailableRoom | undefined
    let foundRate: HotelRateSummary | undefined

    for (const entity of MOCK_HOTEL_ENTITIES) {
      for (const room of entity.rooms) {
        for (const rate of room.rates) {
          if (rate.rateKey === rateKey) {
            foundEntity = entity
            foundRoom = room
            foundRate = rate
            break
          }
        }
        if (foundRate) break
      }
      if (foundRate) break
    }

    // Support simulated test scenarios encoded into synthetic rate keys
    if (rateKey.includes('test-rate-changed')) {
      return {
        rateKey,
        hotel: { provider: this.name, id: 'mock-test-hotel' },
        roomName: 'Standard Room',
        mealPlan: 'Todo Incluido',
        total: { amount: '299.00', currency: 'USD' },
        cancellationSummary: 'Tarifa modificada por proveedor.',
        status: 'changed',
      }
    }

    if (rateKey.includes('test-rate-unavailable')) {
      return {
        rateKey,
        hotel: { provider: this.name, id: 'mock-test-hotel' },
        roomName: 'Standard Room',
        mealPlan: 'Todo Incluido',
        total: { amount: '250.00', currency: 'USD' },
        status: 'unavailable',
      }
    }

    if (!foundRate || !foundEntity || !foundRoom) {
      throw new HotelRateUnavailableError(rateKey, { provider: this.name })
    }

    return {
      rateKey: foundRate.rateKey,
      hotel: foundEntity.details.reference,
      roomName: foundRoom.name,
      mealPlan: foundRate.mealPlan,
      total: foundRate.total,
      cancellationSummary: foundRate.cancellationSummary,
      status: 'available',
    }
  }
}
