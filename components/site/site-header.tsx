import Image from 'next/image'
import Link from 'next/link'
import { MobileNavigation } from '@/components/site/mobile-navigation'
import { siteConfig } from '@/config/site'

export function SiteHeader() {
  return (
    <header className="new-site-header">
      <Link href="/" className="new-site-brand" aria-label="Soleando, inicio">
        <Image src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png" alt="Soleando" width={200} height={60} priority />
      </Link>
      <nav className="new-desktop-nav" aria-label="Navegación principal">
        {siteConfig.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
      <a className="site-button site-button-dark header-whatsapp" href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
      <MobileNavigation />
    </header>
  )
}
