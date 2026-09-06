import Link from 'next/link'

export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { OfferForm } from '@/components/offer-form'

export default async function NewOfferPage() { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) redirect('/admin/login'); return <main className="admin-shell"><header className="admin-topbar"><Link className="brand" href="/admin"><span className="brand-mark">S</span><span>soleando</span></Link><Link className="text-link" href="/admin">← Volver al panel</Link></header><section className="admin-form-page"><p className="eyebrow">Nueva oferta</p><h1>Agrega una nueva<br /><em>experiencia.</em></h1><p className="muted">Las ofertas manuales viven junto a las que lleguen de Instagram. Tus correcciones siempre tendrán prioridad.</p><OfferForm /></section></main> }
