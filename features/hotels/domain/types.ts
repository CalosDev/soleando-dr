/**
 * Opaque reference identifying a hotel across multiple providers.
 */
export interface HotelReference {
  provider: string
  id: string
}

/**
 * Monetary representation using decimal strings to avoid IEEE-754 float precision issues.
 */
export interface Money {
  amount: string
  currency: string
}

/**
 * Room occupancy breakdown with adult count and individual child ages.
 */
export interface RoomOccupancy {
  adults: number
  childrenAges: number[]
}

/**
 * Normalized input parameters for hotel searches.
 */
export interface HotelSearchInput {
  destination: string
  checkIn: string // YYYY-MM-DD
  checkOut: string // YYYY-MM-DD
  rooms: RoomOccupancy[]
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'unknown'
export type RefundableStatus = 'refundable' | 'non_refundable' | 'conditional' | 'unknown'
export type RateStatus = 'available' | 'changed' | 'unavailable'

/**
 * Hotel search result item shown in search listings.
 */
export interface HotelSearchResult {
  reference: HotelReference
  slug: string
  name: string
  destination: string
  destinationSlug?: string
  address?: string
  stars?: number
  rating?: number
  reviewCount?: number
  imageUrl?: string
  amenities: string[]
  mealPlans: string[]
  startingPrice?: Money
  badge?: string
  availabilityStatus: AvailabilityStatus
}

export interface HotelImage {
  url: string
  alt?: string
}

export interface HotelAmenity {
  code: string
  name: string
}

export interface HotelPolicySummary {
  checkInTime?: string
  checkOutTime?: string
  cancellationSummary?: string
}

/**
 * Comprehensive hotel information for detail views.
 */
export interface HotelDetails {
  reference: HotelReference
  slug: string
  name: string
  description: string
  destination: string
  destinationSlug?: string
  address?: string
  latitude?: number
  longitude?: number
  stars?: number
  rating?: number
  reviewCount?: number
  images: HotelImage[]
  amenities: HotelAmenity[]
  policies?: HotelPolicySummary
}

/**
 * Summary of a room rate option.
 */
export interface HotelRateSummary {
  rateKey: string // Opaque token
  roomName: string
  mealPlan?: string
  refundableStatus: RefundableStatus
  total: Money
  cancellationSummary?: string
}

/**
 * Available room category with associated rates.
 */
export interface AvailableRoom {
  id: string
  name: string
  description?: string
  occupancy: {
    maxAdults: number
    maxChildren: number
    maxTotal: number
  }
  rates: HotelRateSummary[]
}

/**
 * Availability response containing available rooms for given dates.
 */
export interface HotelAvailability {
  hotel: HotelReference
  checkIn: string
  checkOut: string
  rooms: AvailableRoom[]
}

/**
 * Re-validated rate details prior to checkout.
 */
export interface HotelRate {
  rateKey: string
  hotel: HotelReference
  roomName: string
  mealPlan?: string
  total: Money
  cancellationSummary?: string
  status: RateStatus
}
