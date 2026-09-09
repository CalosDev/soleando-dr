import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display, Anton } from 'next/font/google'
import { PwaProvider } from '@/components/pwa-provider'
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp'
import './globals.css'
import { Toaster } from 'sileo'
import { siteConfig } from '@/config/site'
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
  preload: false,
})
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: 'Soleando DR | Hoteles, viajes y experiencias',
  description: 'Encuentra hoteles, destinos y experiencias para tu próximo viaje en República Dominicana y el Caribe con Soleando.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Soleando',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/Soleando.ico', type: 'image/x-icon' },
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/Soleando.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1c1917',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-background" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${dmSerif.variable} ${anton.variable} antialiased`} suppressHydrationWarning>
        {children}
        <FloatingWhatsApp />
        <PwaProvider />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Toaster />
      </body>
    </html>
  )
}

