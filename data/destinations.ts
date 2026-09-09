export interface Destination {
  id: string
  name: string
  slug: string
  region: string
  description: string
  image: string
  hotelCount: number
  isMock: true
}

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: 'dest-punta-cana',
    name: 'Punta Cana',
    slug: 'punta-cana',
    region: 'La Altagracia, Este',
    description: 'Playas kilométricas de arena blanca, palmeras infinitas y los resorts todo incluido más reconocidos del Caribe.',
    image: '/soleando-paradise.jpg',
    hotelCount: 64,
    isMock: true,
  },
  {
    id: 'dest-bayahibe',
    name: 'Bayahíbe',
    slug: 'bayahibe',
    region: 'La Romana, Sur-Este',
    description: 'Aguas turquesas y tranquilas frente al Mar Caribe, puerta de entrada a la paradisíaca Isla Saona.',
    image: '/soleando-beach.png',
    hotelCount: 22,
    isMock: true,
  },
  {
    id: 'dest-samana',
    name: 'Samaná',
    slug: 'samana',
    region: 'Península de Samaná, Nororiente',
    description: 'Naturaleza salvaje, cascadas escondidas, playas vírgenes y avistamiento de ballenas jorobadas.',
    image: '/soleando-waterfall.png',
    hotelCount: 18,
    isMock: true,
  },
  {
    id: 'dest-puerto-plata',
    name: 'Puerto Plata',
    slug: 'puerto-plata',
    region: 'Costa Norte',
    description: 'La novia del Atlántico, con su arquitectura victoriana, teleférico, deportes acuáticos y resorts familiares.',
    image: '/soleando-sunset.png',
    hotelCount: 31,
    isMock: true,
  },
  {
    id: 'dest-cap-cana',
    name: 'Cap Cana',
    slug: 'cap-cana',
    region: 'Punta Cana, Este',
    description: 'Destino exclusivo con marina de clase mundial, campos de golf de renombre y resorts de ultralujo.',
    image: '/soleando-hero.webp',
    hotelCount: 14,
    isMock: true,
  },
  {
    id: 'dest-la-romana',
    name: 'La Romana',
    slug: 'la-romana',
    region: 'Región Este',
    description: 'Elegancia caribeña, villa medieval Altos de Chavón y resorts con playas serenas y gastronomía gourmet.',
    image: '/soleando-beach.png',
    hotelCount: 16,
    isMock: true,
  },
]
