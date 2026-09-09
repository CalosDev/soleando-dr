export interface MockHotel {
  id: string
  name: string
  slug: string
  destination: string
  destinationSlug: string
  stars: number
  rating: number
  reviewCount: number
  mealPlan: string
  priceFrom: number
  currency: string
  image: string
  badge?: string
  amenities: string[]
  isMock: true
}

export const MOCK_HOTELS: MockHotel[] = [
  {
    id: 'hotel-lopesan-costa-bavaro',
    name: 'Lopesan Costa Bávaro Resort & Spa',
    slug: 'lopesan-costa-bavaro',
    destination: 'Punta Cana',
    destinationSlug: 'punta-cana',
    stars: 5,
    rating: 4.8,
    reviewCount: 420,
    mealPlan: 'Todo Incluido Premium',
    priceFrom: 285,
    currency: 'USD',
    image: '/soleando-paradise.jpg',
    badge: 'Más Popular',
    amenities: ['6 Piscinas', 'Parque acuático', '12 Restaurantes', 'Frente a la playa', 'Wi-Fi gratis', 'Spa'],
    isMock: true,
  },
  {
    id: 'hotel-royalton-splash',
    name: 'Royalton Splash Punta Cana',
    slug: 'royalton-splash-punta-cana',
    destination: 'Punta Cana',
    destinationSlug: 'punta-cana',
    stars: 5,
    rating: 4.6,
    reviewCount: 310,
    mealPlan: 'Todo Incluido Familiar',
    priceFrom: 210,
    currency: 'USD',
    image: '/soleando-beach.png',
    badge: 'Ideal Familias',
    amenities: ['Mega parque acuático', 'Club de niños', 'Playa privada', '8 Restaurantes', 'Deportes náuticos'],
    isMock: true,
  },
  {
    id: 'hotel-hilton-la-romana',
    name: 'Hilton La Romana All-Inclusive',
    slug: 'hilton-la-romana',
    destination: 'Bayahíbe',
    destinationSlug: 'bayahibe',
    stars: 5,
    rating: 4.9,
    reviewCount: 280,
    mealPlan: 'Todo Incluido de Lujo',
    priceFrom: 340,
    currency: 'USD',
    image: '/soleando-sunset.png',
    badge: 'Aguas Calmas',
    amenities: ['Mar Caribe sereno', 'Sección Solo Adultos', 'Piscina infinity', 'Gastronomía gourmet', 'Snorkel'],
    isMock: true,
  },
  {
    id: 'hotel-bahia-principe-cayo-levantado',
    name: 'Cayo Levantado Resort',
    slug: 'cayo-levantado-resort',
    destination: 'Samaná',
    destinationSlug: 'samana',
    stars: 5,
    rating: 4.9,
    reviewCount: 195,
    mealPlan: 'Todo Incluido Exclusivo',
    priceFrom: 490,
    currency: 'USD',
    image: '/soleando-waterfall.png',
    badge: 'Experiencia Isla',
    amenities: ['Isla privada', 'Bienestar holístico', 'Playa virgen', 'Acceso en lancha privada', 'Alta cocina'],
    isMock: true,
  },
  {
    id: 'hotel-senator-puerto-plata',
    name: 'Senator Puerto Plata Spa Resort',
    slug: 'senator-puerto-plata',
    destination: 'Puerto Plata',
    destinationSlug: 'puerto-plata',
    stars: 5,
    rating: 4.5,
    reviewCount: 230,
    mealPlan: 'Todo Incluido',
    priceFrom: 165,
    currency: 'USD',
    image: '/soleando-hero.webp',
    badge: 'Excelente Valor',
    amenities: ['Frente a la bahía', 'Piscina con swim-up bar', 'Restaurantes temáticos', 'Gimnasio & Spa'],
    isMock: true,
  },
  {
    id: 'hotel-sanctuary-cap-cana',
    name: 'Sanctuary Cap Cana Solo Adultos',
    slug: 'sanctuary-cap-cana',
    destination: 'Cap Cana',
    destinationSlug: 'cap-cana',
    stars: 5,
    rating: 4.9,
    reviewCount: 360,
    mealPlan: 'Todo Incluido Solo Adultos',
    priceFrom: 420,
    currency: 'USD',
    image: '/soleando-paradise.jpg',
    badge: 'Solo Adultos',
    amenities: ['Estilo fortaleza colonial', 'Playa privada exclusiva', '5 Piscinas', 'Servicio de mayordomo', 'Marina cercana'],
    isMock: true,
  },
]
