import Link from 'next/link'
import { PublicPageShell } from '@/components/site/public-page-shell'
import { siteConfig } from '@/config/site'

type InformationalPageProps = { title: string; description: string; action?: { label: string; href: string } }

export function InformationalPage({ title, description, action }: InformationalPageProps) {
  return <PublicPageShell><section className="info-page-hero"><p>Soleando</p><h1>{title}</h1><span>{description}</span>{action && <Link href={action.href} className="site-button site-button-primary">{action.label}</Link>}</section></PublicPageShell>
}

export function ContactPage() {
  return <PublicPageShell><section className="info-page-hero"><p>Contacto</p><h1>Hablemos de tu próximo viaje.</h1><span>Cuéntanos el destino, las fechas aproximadas o simplemente la idea que tienes. Te orientamos por WhatsApp.</span><a className="site-button site-button-primary" href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a></section></PublicPageShell>
}
