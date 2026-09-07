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
  instagramUrl: string | null
  instagramMediaId: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  source: 'manual' | 'instagram'
  manualOverrides: string[]
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
    instagramUrl: 'https://www.instagram.com/p/Dc1cfRMRO6K/',
    instagramMediaId: '3978211139917246090',
    status: 'published',
    featured: true,
    source: 'instagram',
    manualOverrides: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'demo-saona',

    slug: 'isla-saona-vip',
    title: 'Isla Saona VIP & Catamarán',
    destination: 'Bayahíbe',
    category: 'Full Day',
    description: 'Navega en catamarán privado, piscina natural con estrellas de mar y almuerzo buffet frente al mar caribeño.',
    price: '79.00',
    currency: 'USD',
    dateLabel: 'Válido este mes',
    includes: ['Catamarán exclusivo', 'Almuerzo buffet', 'Bar abierto'],
    imageUrl: '/soleando-beach.png',
    instagramUrl: 'https://www.instagram.com/soleandodr/',
    instagramMediaId: null,
    status: 'published',
    featured: true,
    source: 'manual',
    manualOverrides: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'demo-sunset',
    slug: 'sunset-cruise-champagne',
    title: 'Sunset Cruise & Champagne',
    destination: 'Punta Cana',
    category: 'Experiencia Privada',
    description: 'Atardecer dorado navegando la costa, música suave y brindis exclusivo al caer el sol caribeño.',
    price: '65.00',
    currency: 'USD',
    dateLabel: 'Horario: 4:30 PM',
    includes: ['Brindis espumoso', 'Snacks gourmet', 'Puesta de sol'],
    imageUrl: '/soleando-sunset.png',
    instagramUrl: null,
    instagramMediaId: null,
    status: 'published',
    featured: true,
    source: 'manual',
    manualOverrides: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'demo-cascadas',
    slug: 'cascadas-jungla-safari',
    title: 'Cascadas & Jungla Safari',
    destination: 'Samaná',
    category: 'Ecoturismo',
    description: 'Senderos tropicales secretos, baño en cascadas cristalinas y deliciosa comida típica dominicana.',
    price: '89.00',
    currency: 'USD',
    dateLabel: 'Salidas diarias',
    includes: ['Transporte 4x4', 'Guía local experto', 'Almuerzo criollo'],
    imageUrl: '/soleando-waterfall.png',
    instagramUrl: null,
    instagramMediaId: null,
    status: 'draft',
    featured: false,
    source: 'manual',
    manualOverrides: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
