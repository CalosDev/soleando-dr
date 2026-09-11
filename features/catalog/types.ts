export interface ExperienceItineraryStep {
  step: string
  title: string
  description: string
}

export interface Experience {
  id: string
  title: string
  slug: string
  destination: string
  category: string
  duration: string
  description: string
  priceFrom: number
  priceRD: number
  currency: string
  image: string
  gallery: string[]
  badge?: string
  rating: number
  reviewCount: number
  difficulty: string
  groupType: string
  included: string[]
  notIncluded: string[]
  itinerary: ExperienceItineraryStep[]
  recommendations: string[]
}

export interface Cruise {
  id: string
  title: string
  line: string
  itinerary: string
  duration: string
  departurePort: string
  description: string
  priceFrom: number
  currency: string
  image: string
  badge?: string
}
