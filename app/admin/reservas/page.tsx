import Link from 'next/link'

import { getAdminReservations } from '@/features/reservations/admin-queries'
import { updateReservationStatusAction } from '@/features/reservations/actions'
import { requireAdmin } from '@/lib/auth-session'

export const dynamic = 'force-dynamic'

const statusLabel: Record<string, string> = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada' }

export default async function AdminReservationsPage() {
  await requireAdmin('/admin/reservas')
  const items = await getAdminReservations()

  return <main className="admin-shell"><section className="admin-content"><div className="admin-heading"><div><p className="eyebrow">Administración</p><h1>Reservas</h1><p className="muted">Registra únicamente reservas confirmadas o gestionadas por el equipo.</p></div><div className="flex gap-3"><Link className="button" href="/admin">Catálogo</Link><Link className="button button-sun" href="/admin/reservas/nueva">Nueva reserva ↗</Link></div></div><div className="admin-list"><div className="admin-list-head"><span>Reserva y cliente</span><span>Estado</span></div>{items.length ? items.map(({ reservation, customerName, customerEmail }) => <div className="admin-row" key={reservation.id}><div><strong>{reservation.title}</strong><small>{customerName || customerEmail} · {reservation.destination}{reservation.providerReference ? ` · Ref. ${reservation.providerReference}` : ''}</small></div><form action={updateReservationStatusAction.bind(null, reservation.id)} className="flex items-center gap-2"><select aria-label={`Estado de ${reservation.title}`} name="status" defaultValue={reservation.status} className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-sm"><option value="pending">Pendiente</option><option value="confirmed">Confirmada</option><option value="completed">Completada</option><option value="cancelled">Cancelada</option></select><button className="text-link" type="submit">Guardar</button></form></div>) : <div className="empty-state"><p>No hay reservas registradas todavía.</p><Link className="text-link" href="/admin/reservas/nueva">Registra la primera reserva ↗</Link></div>}</div></section></main>
}
