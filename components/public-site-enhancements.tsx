'use client'

import { usePathname } from 'next/navigation'
import { PwaProvider } from '@/components/pwa-provider'
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp'

export function PublicSiteEnhancements() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <FloatingWhatsApp />
      <PwaProvider />
    </>
  )
}
