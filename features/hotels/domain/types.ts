export type HotelProviderName = 'mock'

export type HotelReference = {
  provider: HotelProviderName
  id: string
}

export type Money = {
  amount: string
  currency: string
}

export type RoomOccupancy = {
  adults: number
  childrenAges: number[]
}

export type HotelSearchInput = {
  destination: string
  checkIn: string
  checkOut: string
  rooms: RoomOccupancy[]
}

export type HotelAvailabilityStatus = 'available' | 'unavailable' | 'unknown'

export type HotelSearchResult = {
  reference: HotelReference
  slug: string
  name: string
  destination: string
  imageUrl: string
  stars: number
  mealPlan: string
  highlight?: string
  availabilityStatus: HotelAvailabilityStatus
  startingPrice?: Money
}

export type HotelDetails = HotelSearchResult & {
  description: string
  amenities: string[]
}

export type CancellationSummary = {
  description: string
  refundable: boolean
}

export type HotelRate = {
  rateKey: string
  roomName: string
  total: Money
  cancellation: CancellationSummary
}

export type AvailableRoom = {
  roomName: string
  rates: HotelRate[]
}

export type HotelAvailability = {
  reference: HotelReference
  status: HotelAvailabilityStatus
  rooms: AvailableRoom[]
}
