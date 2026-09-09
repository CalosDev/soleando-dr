'use client'

import { FormEvent, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { searchDestinations } from '@/data/destinations'

function dateForInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

type HotelSearchFormInitialValues = {
  destination?: string
  checkIn?: string
  checkOut?: string
  adults?: number
  rooms?: number
  childrenAges?: number[]
}

export function HotelSearchForm({ initialValues }: { initialValues?: HotelSearchFormInitialValues }) {
  const today = useMemo(() => dateForInput(new Date()), [])
  const [destination, setDestination] = useState(initialValues?.destination ?? 'Punta Cana')
  const [checkIn, setCheckIn] = useState(initialValues?.checkIn ?? '')
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut ?? '')
  const [adults, setAdults] = useState(initialValues?.adults ?? 2)
  const [childrenAges, setChildrenAges] = useState<string[]>(() => initialValues?.childrenAges?.map(String) ?? [])
  const [rooms, setRooms] = useState(initialValues?.rooms ?? 1)
  const [error, setError] = useState('')
  const [isNavigating, startTransition] = useTransition()
  const router = useRouter()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!destination) return setError('Selecciona un destino para continuar.')
    if (checkIn && checkIn < today) return setError('La fecha de entrada no puede ser anterior a hoy.')
    if (checkIn && !checkOut) return setError('Selecciona una fecha de salida.')
    if (!checkIn || !checkOut) return setError('Selecciona las fechas de tu estancia.')
    if (checkOut <= checkIn) return setError('La salida debe ser posterior a la entrada.')
    if (adults < rooms) return setError('Cada habitación debe incluir al menos un adulto.')
    if (childrenAges.some((age) => !/^\d+$/.test(age) || Number(age) > 17)) return setError('Indica una edad válida para cada niño (de 0 a 17 años).')
    setError('')
    const params = new URLSearchParams({ destination: destination.toLowerCase().replace(/\s+/g, '-'), checkIn, checkOut, adults: String(adults), rooms: String(rooms) })
    if (childrenAges.length) params.set('childAges', childrenAges.join(','))
    startTransition(() => router.push(`/hoteles?${params.toString()}`))
  }

  return (
    <form className="hotel-search-form" onSubmit={submit} noValidate>
      <label><span>Destino</span><select value={destination} onChange={(event) => setDestination(event.target.value)}>{searchDestinations.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Entrada</span><input type="date" min={today} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></label>
      <label><span>Salida</span><input type="date" min={checkIn || today} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
      <fieldset className="guest-select"><legend>Huéspedes</legend><div><label>Adultos<input aria-label="Adultos" type="number" min={rooms} max="12" value={adults} onChange={(event) => setAdults(Math.max(rooms, Number(event.target.value)))} /></label><label>Niños<input aria-label="Niños" type="number" min="0" max="8" value={childrenAges.length} onChange={(event) => { const count = Math.max(0, Math.min(8, Number(event.target.value))); setChildrenAges((ages) => Array.from({ length: count }, (_, index) => ages[index] ?? '')) }} /></label><label>Habitaciones<input aria-label="Habitaciones" type="number" min="1" max="8" value={rooms} onChange={(event) => { const nextRooms = Math.max(1, Math.min(8, Number(event.target.value))); setRooms(nextRooms); setAdults((current) => Math.max(current, nextRooms)) }} /></label></div>{childrenAges.length > 0 && <div className="child-ages" aria-label="Edades de los niños">{childrenAges.map((age, index) => <label key={index}>Edad niño {index + 1}<input aria-label={`Edad del niño ${index + 1}`} type="number" min="0" max="17" value={age} onChange={(event) => setChildrenAges((ages) => ages.map((currentAge, currentIndex) => currentIndex === index ? event.target.value : currentAge))} /></label>)}</div>}</fieldset>
      <button className="site-button site-button-primary" type="submit" disabled={isNavigating}>{isNavigating ? 'Buscando…' : 'Buscar hoteles'}</button>
      {error && <p className="search-error" role="alert">{error}</p>}
    </form>
  )
}
