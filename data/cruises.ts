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

export const CRUISES_DATA: Cruise[] = [
  {
    id: 'cruise-caribe-este',
    title: 'Caribe Oriental: Bahamas, St. Thomas & St. Maarten',
    line: 'Royal Caribbean / Wonder of the Seas',
    itinerary: 'Miami · Perfect Day at CocoCay · St. Thomas · St. Maarten · Miami',
    duration: '7 Noches',
    departurePort: 'Miami, Florida',
    description: 'Navega en uno de los barcos más imponentes del mundo. Simuladores de surf, pista de hielo, Broadway shows y playas caribeñas legendarias.',
    priceFrom: 689,
    currency: 'USD',
    image: '/soleando-beach.png',
    badge: 'Popular',
  },
  {
    id: 'cruise-antillas-sur',
    title: 'Antillas del Sur & Islas ABC: Aruba, Bonaire & Curaçao',
    line: 'Norwegian Cruise Line',
    itinerary: 'La Romana / Santo Domingo · Curaçao · Aruba · Bonaire · La Romana',
    duration: '7 Noches',
    departurePort: 'La Romana / Santo Domingo (Sin visa americana requerida)',
    description: 'Salida directa desde República Dominicana sin necesidad de visado estadounidense. Aguas cristalinas y rica cultura holandesa caribeña.',
    priceFrom: 790,
    currency: 'USD',
    image: '/soleando-sunset.png',
    badge: 'Sin Visa Americana',
  },
  {
    id: 'cruise-caribe-occidental',
    title: 'Caribe Occidental & Ruinas Mayas: Cozumel, Roatán & Costa Maya',
    line: 'MSC Cruises',
    itinerary: 'Miami · Roatán (Honduras) · Costa Maya (México) · Cozumel · Ocean Cay MSC Marine Reserve',
    duration: '7 Noches',
    departurePort: 'Miami, Florida',
    description: 'Aventura, snorkel en el segundo arrecife de coral más grande del mundo y una isla reserva marina exclusiva en las Bahamas.',
    priceFrom: 599,
    currency: 'USD',
    image: '/soleando-paradise.jpg',
    badge: 'Mejor Precio',
  },
]
