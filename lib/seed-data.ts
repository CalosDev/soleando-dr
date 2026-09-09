export interface SeedOffer {
  id: string
  slug: string
  title: string
  destination: string
  category: string
  description: string
  price: string | null
  currency: string
  dateLabel: string | null
  includes: string[]
  imageUrl: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export const SEED_OFFERS: SeedOffer[] = [
  {
    id: 'peru-semana-santa-2027',
    slug: 'peru-unico-semana-santa-2027',
    title: 'Perú Único – Semana Santa 2027',
    destination: 'Lima, Cusco & Machu Picchu, Perú',
    category: 'Viajes',
    description: 'Esta Semana Santa vive 9 días descubriendo lo mejor de Perú, desde la historia y gastronomía de Lima hasta la magia de Cusco, el Valle Sagrado y el impresionante Machu Picchu. Salida desde Santo Domingo. Reserva tu espacio con solo US$150.',
    price: '2280.00',
    currency: 'USD',
    dateLabel: '21 al 29 de marzo 2027 · 9 días / 8 noches',
    includes: [
      'Boletos aéreos Santo Domingo – Lima y vuelos internos',
      '8 noches de alojamiento y traslados privados',
      'Tours Lima, Barranco y Miraflores + experiencia gastronómica',
      'Valle Sagrado: Misminay, Moray y Ollantaytambo',
      'Tren Expedition ida y vuelta a Machu Picchu',
      'Entrada y visita guiada a Machu Picchu con buses',
      'Almuerzo en Café Inkaterra',
      'City Tour de Cusco completo',
      'Seguro de viaje y equipaje'
    ],
    imageUrl: '/soleando-peru.jpg',
    status: 'published',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
