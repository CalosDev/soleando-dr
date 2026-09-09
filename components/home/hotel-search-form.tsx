'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchDestinations } from '@/data/destinations'

const dateForInput = (date: Date) => date.toISOString().slice(0, 10)

export function HotelSearchForm() {
  const today = useMemo(() => dateForInput(new Date()), [])
  const [destination, setDestination] = useState('Punta Cana')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [error, setError] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!destination) return setError('Selecciona un destino para continuar.')
    if (checkIn && checkIn < today) return setError('La fecha de entrada no puede ser anterior a hoy.')
    if (checkIn && !checkOut) return setError('Selecciona una fecha de salida.')
    if (checkIn && checkOut && checkOut <= checkIn) return setError('La salida debe ser posterior a la entrada.')
    setError('')
    setIsNavigating(true)
    const params = new URLSearchParams({ destination: destination.toLowerCase().replace(/\s+/g, '-'), adults: String(adults), children: String(children), rooms: String(rooms) })
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    router.push(`/hoteles?${params.toString()}`)
  }

  return (
    <form className="hotel-search-form" onSubmit={submit} noValidate>
      <label><span>Destino</span><select value={destination} onChange={(event) => setDestination(event.target.value)}>{searchDestinations.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Entrada</span><input type="date" min={today} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></label>
      <label><span>Salida</span><input type="date" min={checkIn || today} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
      <fieldset className="guest-select"><legend>Huéspedes</legend><div><label>Adultos<input aria-label="Adultos" type="number" min="1" max="12" value={adults} onChange={(event) => setAdults(Math.max(1, Number(event.target.value)))} /></label><label>Niños<input aria-label="Niños" type="number" min="0" max="8" value={children} onChange={(event) => setChildren(Math.max(0, Number(event.target.value)))} /></label><label>Habitaciones<input aria-label="Habitaciones" type="number" min="1" max="6" value={rooms} onChange={(event) => setRooms(Math.max(1, Number(event.target.value)))} /></label></div></fieldset>
      <button className="site-button site-button-primary" type="submit" disabled={isNavigating}>{isNavigating ? 'Buscando…' : 'Buscar hoteles'}</button>
      {error && <p className="search-error" role="alert">{error}</p>}
    </form>
  )
}
