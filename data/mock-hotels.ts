export type MockHotel = {
  id: string
  slug: string
  name: string
  destination: string
  image: string
  stars: number
  mealPlan: string
  badge?: string
  priceLabel?: string
  isMock: true
}

export const mockHotels: MockHotel[] = [
  { id: 'lopesan-costa-bavaro', slug: 'lopesan-costa-bavaro', name: 'Lopesan Costa Bávaro', destination: 'Punta Cana', image: '/soleando-beach.png', stars: 5, mealPlan: 'Todo incluido', badge: 'Para disfrutar en pareja', priceLabel: 'Consulta opciones', isMock: true },
  { id: 'casa-de-campo', slug: 'casa-de-campo', name: 'Casa de Campo Resort & Villas', destination: 'La Romana', image: '/soleando-paradise.jpg', stars: 5, mealPlan: 'Plan a tu medida', badge: 'Escapada especial', priceLabel: 'Consulta opciones', isMock: true },
  { id: 'viva-wyndham-dominicus', slug: 'viva-wyndham-dominicus', name: 'Viva Wyndham Dominicus Beach', destination: 'Bayahibe', image: '/soleando-sunset.png', stars: 4, mealPlan: 'Todo incluido', badge: 'Frente al mar', priceLabel: 'Consulta opciones', isMock: true },
]
