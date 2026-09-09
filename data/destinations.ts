export type Destination = {
  name: string
  slug: string
  region: string
  image: string
}

export const destinations: Destination[] = [
  { name: 'Punta Cana', slug: 'punta-cana', region: 'Este de República Dominicana', image: '/soleando-beach.png' },
  { name: 'Bayahibe', slug: 'bayahibe', region: 'Costa Caribe', image: '/soleando-paradise.jpg' },
  { name: 'La Romana', slug: 'la-romana', region: 'Este de República Dominicana', image: '/soleando-sunset.png' },
  { name: 'Puerto Plata', slug: 'puerto-plata', region: 'Costa Norte', image: '/soleando-waterfall.png' },
  { name: 'Samaná', slug: 'samana', region: 'Península de Samaná', image: '/soleando-hero.webp' },
]

export const searchDestinations = [
  'Punta Cana', 'Bávaro', 'Cap Cana', 'La Romana', 'Bayahibe', 'Puerto Plata', 'Samaná', 'Santo Domingo',
] as const
