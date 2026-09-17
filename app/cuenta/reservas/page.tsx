import Link from 'next/link'
import { CalendarCheck, ChevronRight, MapPin, Users } from 'lucide-react'

import { AccountNavigation } from '@/components/account/account-navigation'
import { requireUser } from '@/lib/auth-session'
import { getReservationsForUser } from '@/features/reservations/queries'

export const dynamic = 'force-dynamic'

const statusLabel = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada' } as const
const statusStyle = { pending: 'bg-amber-100 text-amber-900', confirmed: 'bg-emerald-100 text-emerald-900', cancelled: 'bg-red-100 text-red-800', completed: 'bg-sky-100 text-sky-900' } as const
const typeLabel = { hotel: 'Hotel', tour: 'Tour', excursion_national: 'Excursión nacional', excursion_international: 'Excursión internacional', cruise: 'Crucero' } as const

function dateLabel(value: string | null) {
  return value ? new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : 'Por confirmar'
}

export default async function ReservationsPage() {
  const currentUser = await requireUser('/cuenta/reservas')
  const items = await getReservationsForUser(currentUser.id)

  return <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
    <AccountNavigation />
    <header className="mb-8"><p className="text-xs font-bold tracking-[0.16em] uppercase text-[#f64d0b]">Mi cuenta</p><h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950">Mis reservas</h1><p className="mt-2 text-stone-600">Consulta el estado y los datos de tus viajes gestionados por Soleando.</p></header>
    {items.length === 0 ? <section className="rounded-3xl border border-[#ede8e1] bg-white px-6 py-14 text-center shadow-xs"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#f64d0b]"><CalendarCheck className="h-7 w-7" /></div><h2 className="mt-5 text-xl font-bold text-stone-900">Aún no tienes reservas registradas</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">Cuando una reserva sea gestionada y confirmada por nuestro equipo, aparecerá aquí con su referencia y estado.</p><Link href="/hoteles" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f64d0b] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e04408]">Buscar alojamiento <ChevronRight className="h-4 w-4" /></Link></section> : <div className="grid gap-4">{items.map((item) => <article key={item.id} className="rounded-3xl border border-[#ede8e1] bg-white p-5 sm:p-6 shadow-xs"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-wider text-[#f64d0b]">{typeLabel[item.kind as keyof typeof typeLabel] ?? item.kind}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[item.status as keyof typeof statusStyle] ?? statusStyle.pending}`}>{statusLabel[item.status as keyof typeof statusLabel] ?? item.status}</span></div><h2 className="mt-2 text-xl font-bold text-stone-950">{item.title}</h2><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600"><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#f64d0b]" />{item.destination}</span><span className="inline-flex items-center gap-1.5"><CalendarCheck className="h-4 w-4 text-[#f64d0b]" />{dateLabel(item.startsOn)}{item.endsOn ? ` — ${dateLabel(item.endsOn)}` : ''}</span><span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-[#f64d0b]" />{item.travelerCount} {item.travelerCount === 1 ? 'viajero' : 'viajeros'}</span></div></div>{item.providerReference && <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm sm:text-right"><p className="text-xs font-bold uppercase tracking-wider text-stone-500">Referencia</p><p className="mt-1 font-semibold text-stone-900">{item.providerReference}</p></div>}</div>{item.customerNote && <p className="mt-5 border-t border-stone-100 pt-4 text-sm leading-6 text-stone-600">{item.customerNote}</p>}</article>)}</div>}
  </main>
}
