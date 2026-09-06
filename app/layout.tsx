import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-display' })

export const metadata: Metadata = {
  title: 'Soleando | Excursiones que se quedan contigo',
  description: 'Descubre excursiones, tours y experiencias auténticas en República Dominicana con Soleando.',
  generator: 'v0.app',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f5f2ec', userScalable: false }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className="bg-background"><body className={`${dmSans.variable} ${dmSerif.variable} antialiased`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
