import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Soleando | Excursiones y Experiencias en RD',
    short_name: 'Soleando',
    description: 'Descubre excursiones, tours y experiencias auténticas en República Dominicana con Soleando.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1c1917',
    theme_color: '#fadc40',
    orientation: 'portrait',
    scope: '/',
    categories: ['travel', 'lifestyle', 'tourism'],
    lang: 'es',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/maskable-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
