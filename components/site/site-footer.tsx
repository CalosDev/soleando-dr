import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="new-site-footer">
      <div className="footer-grid">
        <div className="footer-brand-block">
          <Link href="/" aria-label="Soleando, inicio"><Image src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png" alt="Soleando" width={170} height={51} /></Link>
          <p>Hoteles, viajes y experiencias para disfrutar el Caribe a tu ritmo.</p>
        </div>
        <div><h2>Explora</h2><Link href="/hoteles">Hoteles</Link><Link href="/experiencias">Experiencias</Link><Link href="/cruceros">Cruceros</Link></div>
        <div><h2>Empresa</h2><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link></div>
        <div><h2>Ayuda</h2><a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Soleando</span><span>República Dominicana</span></div>
    </footer>
  )
}
