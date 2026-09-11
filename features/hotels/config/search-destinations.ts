export const HOTEL_SEARCH_DESTINATIONS = [
  { name: 'Punta Cana', slug: 'punta-cana', region: 'La Altagracia' },
  { name: 'Bayahíbe', slug: 'bayahibe', region: 'La Romana' },
  { name: 'Samaná', slug: 'samana', region: 'Península de Samaná' },
  { name: 'Puerto Plata', slug: 'puerto-plata', region: 'Costa Norte' },
  { name: 'Cap Cana', slug: 'cap-cana', region: 'La Altagracia' },
  { name: 'La Romana', slug: 'la-romana', region: 'Región Este' },
] as const

export type HotelDestinationSlug = (typeof HOTEL_SEARCH_DESTINATIONS)[number]['slug']

export function getHotelSearchDestination(slug: string) {
  return HOTEL_SEARCH_DESTINATIONS.find((destination) => destination.slug === slug)
}
