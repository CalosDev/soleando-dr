const CACHE_NAME = 'soleando-shell-v3'
const CACHE_PREFIX = 'soleando-'

// The service worker intentionally does not serve application requests.
// Next.js deployments use build-specific assets, so caching routes or /_next files
// here can mix two deployments and break hydration.
const PRECACHE_ASSETS = [
  '/manifest.webmanifest',
  '/favicon.ico',
  '/Soleando.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-icon-512.png',
  '/apple-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)

      // A missing optional icon must never prevent the new worker from replacing
      // a broken older version.
      await Promise.allSettled(PRECACHE_ASSETS.map((asset) => cache.add(asset)))
      await self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
      await self.clients.claim()
    })()
  )
})

// Keep a fetch listener for installability, but never call respondWith().
// Requests for public pages, authentication, administration, APIs, and Next.js
// build assets always go directly to the network.
self.addEventListener('fetch', () => {})
