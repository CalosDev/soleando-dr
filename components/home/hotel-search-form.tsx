'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ChevronDown,
  Plus,
  Minus,
  AlertCircle,
  Check,
} from 'lucide-react'
import { POPULAR_DESTINATIONS } from '@/data/destinations'

interface HotelSearchFormProps {
  initialDestination?: string
  initialCheckIn?: string
  initialCheckOut?: string
  initialAdults?: number
  initialChildren?: number
  initialRooms?: number
  className?: string
}

export function HotelSearchForm({
  initialDestination = '',
  initialCheckIn,
  initialCheckOut,
  initialAdults = 2,
  initialChildren = 0,
  initialRooms = 1,
  className = '',
}: HotelSearchFormProps) {
  const router = useRouter()

  // Default dates: 1 week from today to 11 days from today
  const todayStr = new Date().toISOString().split('T')[0]
  const defaultIn = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  const defaultOut = new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0]

  const [destination, setDestination] = useState(initialDestination)
  const [checkIn, setCheckIn] = useState(initialCheckIn || defaultIn)
  const [checkOut, setCheckOut] = useState(initialCheckOut || defaultOut)
  const [adults, setAdults] = useState(initialAdults)
  const [children, setChildren] = useState(initialChildren)
  const [rooms, setRooms] = useState(initialRooms)

  // Popover states
  const [destinationPickerOpen, setDestinationPickerOpen] = useState(false)
  const destinationPickerRef = useRef<HTMLDivElement>(null)

  const [guestPickerOpen, setGuestPickerOpen] = useState(false)
  const guestPickerRef = useRef<HTMLDivElement>(null)

  // Error validation state
  const [errorMsg, setErrorMsg] = useState('')

  // Close popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (destinationPickerRef.current && !destinationPickerRef.current.contains(event.target as Node)) {
        setDestinationPickerOpen(false)
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setGuestPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (checkIn && checkOut && checkOut <= checkIn) {
      setErrorMsg('La fecha de salida debe ser posterior a la fecha de entrada.')
      return
    }

    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('adults', adults.toString())
    if (children > 0) params.set('children', children.toString())
    params.set('rooms', rooms.toString())

    router.push(`/hoteles?${params.toString()}`)
  }

  const selectedDestObj = POPULAR_DESTINATIONS.find((d) => d.slug === destination)
  const destinationDisplayLabel = selectedDestObj ? selectedDestObj.name : 'Cualquier destino'

  const guestSummary = `${adults} ad.${children > 0 ? ` · ${children} niñ.` : ''} · ${rooms} hab.`

  return (
    <div className={`w-full max-w-5xl mx-auto relative z-30 ${className}`}>
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-3xl lg:rounded-full p-2 sm:p-2.5 shadow-2xl border border-stone-200/80 flex flex-col lg:flex-row items-stretch lg:items-center gap-1.5"
        aria-label="Buscador de hoteles y alojamientos"
      >
        {/* Campo 1: Destino con Popover Interactivo (Sin select nativo roto) */}
        <div ref={destinationPickerRef} className="relative flex-1 lg:flex-[1.2] min-w-[200px]">
          <button
            type="button"
            onClick={() => {
              setDestinationPickerOpen(!destinationPickerOpen)
              setGuestPickerOpen(false)
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl lg:rounded-full hover:bg-stone-50 transition-colors text-left border border-transparent focus:outline-hidden focus:border-[#f64d0b]/40 cursor-pointer"
            aria-expanded={destinationPickerOpen}
            aria-haspopup="true"
          >
            <div className="flex items-center gap-3 min-w-0">
              <MapPin className="w-5 h-5 text-[#f64d0b] shrink-0" />
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Destino
                </span>
                <span className="text-sm font-semibold text-stone-900 truncate leading-normal">
                  {destinationDisplayLabel}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                destinationPickerOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Desplegable de Destinos */}
          {destinationPickerOpen && (
            <div className="absolute top-full left-0 mt-3 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-3 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 text-left">
              <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Destinos en República Dominicana
              </div>

              <button
                type="button"
                onClick={() => {
                  setDestination('')
                  setDestinationPickerOpen(false)
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors cursor-pointer ${
                  destination === '' ? 'bg-orange-50 text-[#f64d0b]' : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-[#f64d0b] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900">Cualquier destino en RD</span>
                    <span className="text-[10px] text-stone-500 font-normal">Explorar todos los resorts</span>
                  </div>
                </div>
                {destination === '' && <Check className="w-4 h-4 text-[#f64d0b] shrink-0" />}
              </button>

              <div className="h-px bg-stone-100 my-1" />

              {POPULAR_DESTINATIONS.map((d) => {
                const isSelected = destination === d.slug
                return (
                  <button
                    key={d.slug}
                    type="button"
                    onClick={() => {
                      setDestination(d.slug)
                      setDestinationPickerOpen(false)
                    }}
                    className={`w-full flex items-center justify-between p-2.5 px-3 rounded-2xl text-left transition-colors cursor-pointer ${
                      isSelected ? 'bg-orange-50 text-[#f64d0b]' : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-bold text-stone-900">{d.name}</span>
                      <span className="text-[10px] text-stone-500 font-normal">{d.region}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#f64d0b] shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-px h-8 bg-stone-200" aria-hidden="true" />

        {/* Campo 2: Entrada */}
        <div className="flex-1 min-w-[145px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl lg:rounded-full hover:bg-stone-50 transition-colors border border-transparent focus-within:border-[#f64d0b]/40 focus-within:bg-orange-50/20">
          <Calendar className="w-5 h-5 text-[#f64d0b] shrink-0" />
          <div className="flex-1 flex flex-col text-left min-w-0">
            <label htmlFor="search-checkin" className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Entrada
            </label>
            <input
              id="search-checkin"
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value)
                if (checkOut && e.target.value >= checkOut) {
                  const nextDay = new Date(new Date(e.target.value).getTime() + 86400000)
                    .toISOString()
                    .split('T')[0]
                  setCheckOut(nextDay)
                }
              }}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>

        <div className="hidden lg:block w-px h-8 bg-stone-200" aria-hidden="true" />

        {/* Campo 3: Salida */}
        <div className="flex-1 min-w-[145px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl lg:rounded-full hover:bg-stone-50 transition-colors border border-transparent focus-within:border-[#f64d0b]/40 focus-within:bg-orange-50/20">
          <Calendar className="w-5 h-5 text-[#f64d0b] shrink-0" />
          <div className="flex-1 flex flex-col text-left min-w-0">
            <label htmlFor="search-checkout" className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Salida
            </label>
            <input
              id="search-checkout"
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>

        <div className="hidden lg:block w-px h-8 bg-stone-200" aria-hidden="true" />

        {/* Campo 4: Huéspedes & Habitaciones Popover */}
        <div ref={guestPickerRef} className="relative flex-1 min-w-[170px]">
          <button
            type="button"
            onClick={() => {
              setGuestPickerOpen(!guestPickerOpen)
              setDestinationPickerOpen(false)
            }}
            className="w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl lg:rounded-full hover:bg-stone-50 transition-colors text-left border border-transparent focus:outline-hidden focus:border-[#f64d0b]/40 cursor-pointer"
            aria-expanded={guestPickerOpen}
            aria-haspopup="true"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Users className="w-5 h-5 text-[#f64d0b] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Viajeros
                </span>
                <span className="text-sm font-semibold text-stone-900 truncate leading-normal">
                  {guestSummary}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                guestPickerOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Desplegable de Huéspedes */}
          {guestPickerOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-5 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 text-left">
              {/* Adultos */}
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm font-bold text-stone-900 block">Adultos</strong>
                  <span className="text-xs text-stone-400">12+ años</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-30 hover:bg-stone-100 cursor-pointer"
                    aria-label="Reducir adultos"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-stone-900 text-sm">{adults}</span>
                  <button
                    type="button"
                    disabled={adults >= 10}
                    onClick={() => setAdults(Math.min(10, adults + 1))}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-30 hover:bg-stone-100 cursor-pointer"
                    aria-label="Aumentar adultos"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Niños */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div>
                  <strong className="text-sm font-bold text-stone-900 block">Niños</strong>
                  <span className="text-xs text-stone-400">0 a 11 años</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={children <= 0}
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-30 hover:bg-stone-100 cursor-pointer"
                    aria-label="Reducir niños"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-stone-900 text-sm">{children}</span>
                  <button
                    type="button"
                    disabled={children >= 6}
                    onClick={() => setChildren(Math.min(6, children + 1))}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-30 hover:bg-stone-100 cursor-pointer"
                    aria-label="Aumentar niños"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Habitaciones */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div>
                  <strong className="text-sm font-bold text-stone-900 block">Habitaciones</strong>
                  <span className="text-xs text-stone-400">Capacidad requerida</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={rooms <= 1}
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-30 hover:bg-stone-100 cursor-pointer"
                    aria-label="Reducir habitaciones"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-stone-900 text-sm">{rooms}</span>
                  <button
                    type="button"
                    disabled={rooms >= 5}
                    onClick={() => setRooms(Math.min(5, rooms + 1))}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-30 hover:bg-stone-100 cursor-pointer"
                    aria-label="Aumentar habitaciones"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuestPickerOpen(false)}
                className="w-full py-2.5 bg-[#f64d0b] hover:bg-[#d43d06] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Listo
              </button>
            </div>
          )}
        </div>

        {/* Botón Buscar */}
        <div className="p-1">
          <button
            type="submit"
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl lg:rounded-full bg-[#f64d0b] text-white font-bold text-sm shadow-md hover:bg-[#e04408] transition-all transform hover:scale-102 active:scale-98 cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Buscar hoteles</span>
          </button>
        </div>
      </form>

      {/* Mensaje de validación */}
      {errorMsg && (
        <div className="mt-2.5 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  )
}
