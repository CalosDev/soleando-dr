import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display, Anton } from 'next/font/google'
import { PublicSiteOverlays } from '@/components/public-site-overlays'
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
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1c1917',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-background" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${dmSerif.variable} ${anton.variable} antialiased`} suppressHydrationWarning>
        {children}
        <PublicSiteOverlays />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Toaster />
      </body>
    </html>
  )
}

