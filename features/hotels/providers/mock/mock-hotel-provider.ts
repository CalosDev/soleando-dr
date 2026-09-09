import 'server-only'

import { HotelNotFoundError, HotelProviderUnavailableError } from '@/features/hotels/domain/errors'
import type { AvailableRoom, HotelAvailability, HotelDetails, HotelRate, HotelReference, HotelSearchInput, HotelSearchResult, Money } from '@/features/hotels/domain/types'
import type { HotelProvider } from '@/features/hotels/providers/hotel-provider'

type MockScenario = 'default' | 'empty' | 'provider-error' | 'rate-changed' | 'rate-unavailable'

type MockHotel = Omit<HotelSearchResult, 'availabilityStatus'> & { description: string; amenities: string[] }

const hotels: MockHotel[] = [
  { reference: { provider: 'mock', id: 'lopesan-costa-bavaro' }, slug: 'lopesan-costa-bavaro', name: 'Lopesan Costa Bávaro', destination: 'Punta Cana', imageUrl: '/soleando-beach.png', stars: 5, mealPlan: 'Todo incluido', highlight: 'Para disfrutar en pareja', startingPrice: { amount: '24500.00', currency: 'DOP' }, description: 'Contenido de demostración para validar la experiencia del catálogo.', amenities: ['Piscina', 'Playa', 'Restaurantes'] },
  { reference: { provider: 'mock', id: 'casa-de-campo' }, slug: 'casa-de-campo', name: 'Casa de Campo Resort & Villas', destination: 'La Romana', imageUrl: '/soleando-paradise.jpg', stars: 5, mealPlan: 'Plan a tu medida', highlight: 'Escapada especial', startingPrice: { amount: '31900.00', currency: 'DOP' }, description: 'Contenido de demostración para validar la experiencia del catálogo.', amenities: ['Campo de golf', 'Marina', 'Restaurantes'] },
  { reference: { provider: 'mock', id: 'viva-wyndham-dominicus' }, slug: 'viva-wyndham-dominicus', name: 'Viva Wyndham Dominicus Beach', destination: 'Bayahibe', imageUrl: '/soleando-sunset.png', stars: 4, mealPlan: 'Todo incluido', highlight: 'Frente al mar', startingPrice: { amount: '18900.00', currency: 'DOP' }, description: 'Contenido de demostración para validar la experiencia del catálogo.', amenities: ['Piscina', 'Playa', 'Actividades'] },
]

function toResult(hotel: MockHotel, availabilityStatus: HotelSearchResult['availabilityStatus'] = 'unknown'): HotelSearchResult {
  const { description: _description, amenities: _amenities, ...result } = hotel
  return { ...result, availabilityStatus }
}

function matchesDestination(hotel: MockHotel, destination: string) {
  const normalized = destination.trim().toLocaleLowerCase('es-DO')
  return hotel.destination.toLocaleLowerCase('es-DO').includes(normalized) || normalized.includes(hotel.destination.toLocaleLowerCase('es-DO'))
}

export class MockHotelProvider implements HotelProvider {
  readonly name = 'mock' as const

  constructor(private readonly scenario: MockScenario = 'default') {}

  async listFeaturedHotels() {
    this.failForProviderScenario()
    return hotels.map((hotel) => toResult(hotel))
  }

  async searchHotels(input: HotelSearchInput) {
    this.failForProviderScenario()
    if (this.scenario === 'empty') return []
    return hotels.filter((hotel) => matchesDestination(hotel, input.destination)).map((hotel) => toResult(hotel, 'unknown'))
  }

  async getHotelDetails(reference: HotelReference): Promise<HotelDetails> {
    this.failForProviderScenario()
    const hotel = this.findHotel(reference)
    return { ...toResult(hotel), description: hotel.description, amenities: hotel.amenities }
  }

  async getAvailability(reference: HotelReference, _input: HotelSearchInput): Promise<HotelAvailability> {
    this.failForProviderScenario()
    const hotel = this.findHotel(reference)
    if (this.scenario === 'empty') return { reference: hotel.reference, status: 'unavailable', rooms: [] }
    const rate = await this.checkRate(`mock:${hotel.reference.id}:standard`)
    const rooms: AvailableRoom[] = [{ roomName: 'Habitación de demostración', rates: [rate] }]
    return { reference: hotel.reference, status: 'unknown', rooms }
  }

  async checkRate(rateKey: string): Promise<HotelRate> {
    this.failForProviderScenario()
    if (this.scenario === 'rate-unavailable') throw new HotelProviderUnavailableError()
    const [, hotelId] = rateKey.split(':')
    const hotel = hotels.find((item) => item.reference.id === hotelId)
    if (!hotel || !hotel.startingPrice) throw new HotelNotFoundError()
    const total: Money = this.scenario === 'rate-changed'
      ? { ...hotel.startingPrice, amount: (Number(hotel.startingPrice.amount) + 500).toFixed(2) }
      : hotel.startingPrice
    return { rateKey, roomName: 'Habitación de demostración', total, cancellation: { description: 'Condiciones de demostración; confirma con nuestro equipo.', refundable: false } }
  }

  private findHotel(reference: HotelReference) {
    if (reference.provider !== 'mock') throw new HotelNotFoundError()
    const hotel = hotels.find((item) => item.reference.id === reference.id)
    if (!hotel) throw new HotelNotFoundError()
    return hotel
  }

  private failForProviderScenario() {
    if (this.scenario === 'provider-error') throw new HotelProviderUnavailableError()
  }
}
