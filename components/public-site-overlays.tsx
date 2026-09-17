'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp'

export function PublicSiteOverlays() {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  useEffect(() => {
    if (isAdminRoute || typeof window === 'undefined') {
      return
    }

    // One-time compatibility cleanup for visitors who still have the retired PWA.
    // It only touches Soleando-owned caches and registrations for this origin.
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    }

    if ('caches' in window) {
      void caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter((cacheName) => cacheName.startsWith('soleando-'))
              .map((cacheName) => caches.delete(cacheName))
          )
        )
    }
  }, [isAdminRoute])

  if (isAdminRoute) {
    return null
  }

  return <FloatingWhatsApp />
}
