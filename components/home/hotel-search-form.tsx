'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ChevronDown,
  Plus,
  Minus,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react'
import { HOTEL_SEARCH_DESTINATIONS } from '@/features/hotels/config/search-destinations'

interface DestinationSuggestion {
  id: string
  label: string
  type: string
}

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
  // Default dates: 1 week from today to 11 days from today
  const todayStr = new Date().toISOString().split('T')[0]
  const defaultIn = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  const defaultOut = new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0]

  const initialDestinationName = HOTEL_SEARCH_DESTINATIONS.find((item) => item.slug === initialDestination)?.name ?? initialDestination
  const [destination, setDestination] = useState(initialDestinationName)
  const [selectedDestination, setSelectedDestination] = useState<DestinationSuggestion | null>(null)
  const [destinationSuggestions, setDestinationSuggestions] = useState<DestinationSuggestion[]>([])
  const [isDestinationLoading, setIsDestinationLoading] = useState(false)
  const [checkIn, setCheckIn] = useState(initialCheckIn || defaultIn)
  const [checkOut, setCheckOut] = useState(initialCheckOut || defaultOut)
  const [adults, setAdults] = useState(initialAdults)
  const [childrenAges, setChildrenAges] = useState<Array<number | null>>(
    () => Array.from({ length: initialChildren }, () => null),
  )
  const [rooms, setRooms] = useState(initialRooms)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  useEffect(() => {
    const query = destination.trim()
    if (!destinationPickerOpen || query.length < 3 || selectedDestination?.label === query) {
      setDestinationSuggestions([])
      setIsDestinationLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsDestinationLoading(true)
      try {
        const response = await fetch(`/api/hotels/search?query=${encodeURIComponent(query)}`, { signal: controller.signal })
        const result = await response.json() as { suggestions?: DestinationSuggestion[] }
        setDestinationSuggestions(response.ok ? result.suggestions ?? [] : [])
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setDestinationSuggestions([])
      } finally {
        if (!controller.signal.aborted) setIsDestinationLoading(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [destination, destinationPickerOpen, selectedDestination])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!destination) {
      setErrorMsg('Selecciona un destino para consultar disponibilidad real.')
      return
    }

    if (checkIn && checkOut && checkOut <= checkIn) {
      setErrorMsg('La fecha de salida debe ser posterior a la fecha de entrada.')
      return
    }

    if (rooms > adults) {
      setErrorMsg('Cada habitación debe tener al menos un adulto.')
      return
    }

    if (childrenAges.some((age) => age === null)) {
      setErrorMsg('Indica la edad de cada menor para calcular la tarifa correcta.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/hotels/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          providerDestinationId: selectedDestination?.id,
          providerDestinationType: selectedDestination?.type,
          checkIn,
          checkOut,
          adults,
          childrenAges,
          rooms,
        }),
      })
      const result = await response.json() as { redirectUrl?: string; error?: string }

      if (!response.ok || !result.redirectUrl) {
        throw new Error(result.error || 'No pudimos completar la búsqueda.')
      }

      window.location.assign(result.redirectUrl)
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'No pudimos conectar con el motor de reservas.')
      setIsSubmitting(false)
    }
  }

  const children = childrenAges.length
  const guestSummary = `${adults} ad.${children > 0 ? ` · ${children} niñ.` : ''} · ${rooms} hab.`

  return (
    <div className={`w-full max-w-5xl mx-auto relative z-30 ${className}`}>
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-3xl lg:rounded-full p-2 sm:p-2.5 shadow-2xl border border-stone-200/80 flex flex-col lg:flex-row items-stretch lg:items-center gap-1.5"
        aria-label="Buscador de hoteles y alojamientos"
      >
        {/* Campo 1: autocompletado real del proveedor */}
        <div ref={destinationPickerRef} className="relative flex-1 lg:flex-[1.2] min-w-[200px]">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-2.5 text-left transition-colors hover:bg-stone-50 focus-within:border-[#f64d0b]/40 lg:rounded-full">
            <MapPin className="h-5 w-5 shrink-0 text-[#f64d0b]" />
            <div className="flex min-w-0 flex-1 flex-col text-left">
              <label htmlFor="hotel-destination" className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Destino u hotel</label>
              <input
                id="hotel-destination"
                value={destination}
                onFocus={() => {
                  setDestinationPickerOpen(true)
                  setGuestPickerOpen(false)
                }}
                onChange={(event) => {
                  setDestination(event.target.value)
                  setSelectedDestination(null)
                  setDestinationPickerOpen(true)
                }}
                placeholder="Ciudad, hotel o punto de interés"
                autoComplete="off"
                role="combobox"
                aria-expanded={destinationPickerOpen && destination.length >= 3}
                aria-controls="hotel-destination-options"
                className="w-full truncate bg-transparent text-sm font-semibold text-stone-900 outline-hidden placeholder:text-stone-400"
              />
            </div>
            {isDestinationLoading && <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-[#f64d0b]" aria-label="Buscando destinos" />}
          </div>

          {destinationPickerOpen && destination.trim().length >= 3 && !selectedDestination && !isDestinationLoading && (
            <div id="hotel-destination-options" role="listbox" className="absolute left-0 top-full z-50 mt-3 max-h-80 w-80 overflow-y-auto rounded-3xl border border-stone-200/90 bg-white p-2 text-left shadow-2xl ring-1 ring-black/5">
              {destinationSuggestions.length > 0 ? destinationSuggestions.map((suggestion) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => {
                    setDestination(suggestion.label)
                    setSelectedDestination(suggestion)
                    setDestinationPickerOpen(false)
                  }}
                  className="flex w-full items-start justify-between gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-orange-50"
                >
                  <span className="text-xs font-bold leading-relaxed text-stone-900">{suggestion.label}</span>
                  <span className="shrink-0 rounded-full bg-stone-100 px-2 py-1 text-[9px] font-bold text-stone-500">{suggestion.type}</span>
                </button>
              )) : (
                <p className="px-3 py-4 text-xs leading-relaxed text-stone-500">No encontramos coincidencias. Prueba con otro destino o nombre de hotel.</p>
              )}
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
                    onClick={() => {
                      setChildrenAges((ages) => ages.slice(0, -1))
                    }}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-30 hover:bg-stone-100 cursor-pointer"
                    aria-label="Reducir niños"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-stone-900 text-sm">{children}</span>
                  <button
                    type="button"
                    disabled={children >= 6}
                    onClick={() => {
                      setChildrenAges((ages) => ages.length < 6 ? [...ages, null] : ages)
                    }}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-30 hover:bg-stone-100 cursor-pointer"
                    aria-label="Aumentar niños"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {childrenAges.length > 0 && (
                <div className="grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">
                  {childrenAges.map((age, index) => (
                    <label key={index} className="text-[11px] font-bold text-stone-600">
                      Edad menor {index + 1}
                      <select
                        value={age ?? ''}
                        onChange={(event) => {
                          const nextAge = Number(event.target.value)
                          setChildrenAges((ages) => ages.map((current, currentIndex) => currentIndex === index ? nextAge : current))
                        }}
                        className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-[#f64d0b] focus:outline-hidden"
                        required
                      >
                        <option value="" disabled>Seleccionar</option>
                        {Array.from({ length: 18 }, (_, childAge) => (
                          <option key={childAge} value={childAge}>{childAge} años</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              )}

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
            disabled={isSubmitting}
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl lg:rounded-full bg-[#f64d0b] text-white font-bold text-sm shadow-md hover:bg-[#e04408] transition-all transform hover:scale-102 active:scale-98 cursor-pointer shrink-0 disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isSubmitting ? 'Consultando…' : 'Buscar hoteles'}</span>
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
