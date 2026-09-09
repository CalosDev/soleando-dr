'use client'

import { useState } from 'react'
import { siteConfig } from '@/config/site'
import { WhatsappIcon } from '@/components/icons'
import {
  Hotel,
  Palmtree,
  Ship,
  Calendar,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Compass,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export type ServiceType = 'hotel' | 'tour' | 'cruise'

interface ServiceOption {
  id: ServiceType
  title: string
  subtitle: string
  badge?: string
  icon: typeof Hotel
}

// Únicamente los 3 servicios reales que ofrece Soleando DR
const SERVICES: ServiceOption[] = [
  {
    id: 'hotel',
    title: 'Hoteles & Resorts',
    subtitle: 'Resorts todo incluido de playa, familiares y solo adultos en los mejores polos turísticos de RD.',
    badge: 'Todo Incluido',
    icon: Hotel,
  },
  {
    id: 'tour',
    title: 'Experiencias & Excursiones',
    subtitle: 'Isla Saona en catamarán, buggies en Macao, cascadas en Samaná, snorkel y safaris.',
    badge: 'Tours de 1 Día',
    icon: Palmtree,
  },
  {
    id: 'cruise',
    title: 'Cruceros por el Caribe',
    subtitle: 'Itinerarios hacia Antillas del Sur (sin visa americana requerida), Bahamas y Caribe Occidental.',
    badge: 'Salidas Caribe',
    icon: Ship,
  },
]

// Destinos reales de hotelería en República Dominicana
const DESTINATIONS = [
  { id: 'punta-cana', label: 'Punta Cana / Bávaro' },
  { id: 'bayahibe', label: 'Bayahíbe / Dominicus' },
  { id: 'samana', label: 'Samaná / Las Terrenas' },
  { id: 'cap-cana', label: 'Cap Cana' },
  { id: 'la-romana', label: 'La Romana' },
  { id: 'puerto-plata', label: 'Puerto Plata' },
]

// Excursiones reales del catálogo Soleando DR
const REAL_EXPERIENCES = [
  'Isla Saona en Catamarán VIP & Piscina Natural',
  'Safari en Buggies Macao & Cenote Taíno',
  'Montaña Redonda & Playa Esmeralda en Camión 4x4',
  'Cascada El Limón & Cayo Levantado en Samaná',
  'Snorkel en Isla Catalina & Muro de Coral',
  'Santo Domingo Colonial & Los Tres Ojos',
  'Avistamiento de Ballenas Jorobadas en Samaná',
]

// Estilos de resort disponibles
const HOTEL_STYLES = [
  { id: 'familiar', label: 'Familiar con parque acuático y animación' },
  { id: 'adultos', label: 'Solo Adultos (parejas / relax)' },
  { id: 'lujo', label: 'Resort de Lujo & Playa Exclusiva' },
]

// Cruceros reales del catálogo Soleando DR
const REAL_CRUISES = [
  {
    id: 'antillas-sur',
    label: 'Antillas del Sur & Islas ABC (Aruba, Bonaire & Curaçao)',
    note: 'Salida directa desde RD · Sin visa americana',
  },
  {
    id: 'caribe-este',
    label: 'Caribe Oriental (Bahamas, St. Thomas & St. Maarten)',
    note: 'Royal Caribbean · 7 noches',
  },
  {
    id: 'caribe-occidental',
    label: 'Caribe Occidental (Cozumel, Roatán & Costa Maya)',
    note: 'MSC Cruises · 7 noches',
  },
]

const CABIN_TYPES = [
  { id: 'interior', label: 'Camarote Interior (Económico)' },
  { id: 'vista-mar', label: 'Vista al Mar (Ventana / Ojo de buey)' },
  { id: 'balcon', label: 'Balcón Privado frente al mar' },
  { id: 'suite', label: 'Suite de Lujo' },
]

export function InteractiveQuotePlanner() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [submitted, setSubmitted] = useState(false)

  // Form State
  const [selectedService, setSelectedService] = useState<ServiceType>('hotel')
  const [selectedDestination, setSelectedDestination] = useState<string>('Punta Cana / Bávaro')
  const [hotelStyle, setHotelStyle] = useState<string>('Familiar con parque acuático y animación')
  const [preferredHotel, setPreferredHotel] = useState<string>('')
  const [selectedTours, setSelectedTours] = useState<string[]>(['Isla Saona en Catamarán VIP & Piscina Natural'])
  const [selectedCruise, setSelectedCruise] = useState<string>(
    'Antillas del Sur & Islas ABC (Aruba, Bonaire & Curaçao)'
  )
  const [selectedCabin, setSelectedCabin] = useState<string>('Balcón Privado frente al mar')
  const [dates, setDates] = useState<string>('')
  const [nights, setNights] = useState<number>(3)
  const [adults, setAdults] = useState<number>(2)
  const [children, setChildren] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const toggleTour = (tour: string) => {
    setSelectedTours((prev) =>
      prev.includes(tour)
        ? prev.length > 1
          ? prev.filter((t) => t !== tour)
          : prev
        : [...prev, tour]
    )
  }

  // Generar mensaje estructurado para WhatsApp
  const generateMessageText = () => {
    const serviceTitles: Record<ServiceType, string> = {
      hotel: 'Hoteles & Resorts Todo Incluido',
      tour: 'Experiencias & Excursiones',
      cruise: 'Cruceros por el Caribe',
    }

    let details = ''
    if (selectedService === 'hotel') {
      details = `*Destino:* ${selectedDestination}\n*Estilo:* ${hotelStyle}\n*Noches estimadas:* ${nights} noches${
        preferredHotel ? `\n*Hotel de preferencia:* ${preferredHotel}` : ''
      }`
    } else if (selectedService === 'tour') {
      details = `*Excursiones seleccionadas:*\n${selectedTours.map((t) => ` - ${t}`).join('\n')}\n*Zona donde te hospedas:* ${selectedDestination}`
    } else if (selectedService === 'cruise') {
      details = `*Itinerario de Crucero:* ${selectedCruise}\n*Tipo de Camarote:* ${selectedCabin}`
    }

    return `*🌴 COTIZACIÓN DE VIAJE — SOLEANDO DR*
----------------------------------------
*Servicio Solicitado:* ${serviceTitles[selectedService]}
${details}

*Fechas estimadas:* ${dates || 'Por definir'}
*Viajeros:* ${adults} Adulto(s)${children > 0 ? `, ${children} Niño(s)` : ''}
----------------------------------------
*Datos del Cliente:*
*Nombre:* ${name || 'Viajero'}
*WhatsApp:* ${phone || 'No especificado'}
*Email:* ${email || 'No especificado'}
${notes ? `*Comentarios:* ${notes}` : ''}
----------------------------------------
_Enviado desde el portal oficial de Soleando DR_`
  }

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = generateMessageText()
    const url = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            Cotización iniciada
          </span>
          <h2 className="font-serif text-3xl text-stone-900 font-normal">
            ¡Hemos preparado tu solicitud!
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Se ha abierto WhatsApp con los detalles de tu consulta. Uno de nuestros asesores te responderá enseguida con tarifas y disponibilidad confirmada.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 max-w-md mx-auto text-left text-xs text-stone-600 space-y-1.5">
          <p className="font-bold text-stone-900">Resumen de la consulta:</p>
          <p>• <strong>Servicio:</strong> {SERVICES.find((s) => s.id === selectedService)?.title}</p>
          <p>• <strong>Pasajeros:</strong> {adults} Adultos{children > 0 ? `, ${children} Niños` : ''}</p>
          <p>• <strong>Fechas:</strong> {dates || 'Por coordinar'}</p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false)
              setStep(1)
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#f64d0b] hover:underline cursor-pointer"
          >
            <span>Realizar otra cotización</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
      {/* Encabezado y Navegación de Pasos */}
      <div className="bg-stone-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-[#fadc40] mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Cotizador Oficial Soleando</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal">
              Solicita tu Cotización Personalizada
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Selecciona el servicio que buscas en República Dominicana y recibe atención directa sin intermediarios.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 shrink-0 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold">Asesores en WhatsApp</span>
          </div>
        </div>

        {/* Pasos */}
        <div className="grid grid-cols-4 gap-2 text-xs font-bold">
          {[
            { num: 1, label: '1. Servicio' },
            { num: 2, label: '2. Detalles' },
            { num: 3, label: '3. Fechas & Viajeros' },
            { num: 4, label: '4. Contacto' },
          ].map((s) => {
            const isActive = step === s.num
            const isCompleted = step > s.num
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num as 1 | 2 | 3 | 4)}
                className={`py-2 px-1 text-center border-b-2 transition-all cursor-pointer truncate ${
                  isActive
                    ? 'border-[#f64d0b] text-white'
                    : isCompleted
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-stone-700 text-stone-300'
                }`}
              >
                <span className="inline-block truncate">{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {/* ============================================================ */}
        {/* PASO 1: SELECCIÓN DEL SERVICIO REAL (3 OPCIONES EXACTAS) */}
        {/* ============================================================ */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                ¿Qué servicio deseas cotizar hoy?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Selecciona una de las 3 áreas de viaje de Soleando DR:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SERVICES.map((serv) => {
                const isSelected = selectedService === serv.id
                const IconComponent = serv.icon
                return (
                  <button
                    key={serv.id}
                    type="button"
                    onClick={() => setSelectedService(serv.id)}
                    className={`relative p-6 rounded-2xl text-left border-2 transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer ${
                      isSelected
                        ? 'border-[#f64d0b] bg-orange-50/50 shadow-md ring-2 ring-[#f64d0b]/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#f64d0b] text-white'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        <IconComponent className="w-7 h-7" />
                      </div>

                      {serv.badge && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            isSelected
                              ? 'bg-[#f64d0b] text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {serv.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-serif font-bold text-stone-900 mb-1">
                        {serv.title}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {serv.subtitle}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 text-[#f64d0b]">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#f64d0b] hover:bg-[#d43d06] text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Continuar al Paso 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 2: PREFERENCIAS ESPECÍFICAS SEGÚN EL SERVICIO */}
        {/* ============================================================ */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* SERVICIO 1: HOTELES & RESORTS */}
            {selectedService === 'hotel' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#f64d0b]" />
                    <span>¿En qué destino de República Dominicana buscas tu resort?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Elige el polo turístico donde deseas vacacionar:
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {DESTINATIONS.map((dest) => {
                    const isSelected = selectedDestination === dest.label
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => setSelectedDestination(dest.label)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#f64d0b] border-[#f64d0b] text-white shadow-xs'
                            : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {dest.label}
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-stone-800">
                    Estilo de Resort o Ambiente:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {HOTEL_STYLES.map((style) => {
                      const isSelected = hotelStyle === style.label
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setHotelStyle(style.label)}
                          className={`p-3.5 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#f64d0b] bg-orange-50 text-stone-900'
                              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <span>{style.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#f64d0b] shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-stone-800">
                    ¿Tienes algún hotel específico en mente? (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Lopesan Costa Bávaro, Royalton Splash, Hilton La Romana..."
                    value={preferredHotel}
                    onChange={(e) => setPreferredHotel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900"
                  />
                </div>
              </div>
            )}

            {/* SERVICIO 2: EXPERIENCIAS & EXCURSIONES */}
            {selectedService === 'tour' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#f64d0b]" />
                    <span>¿Qué excursión o tour deseas realizar?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Puedes marcar una o varias actividades de nuestro catálogo:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REAL_EXPERIENCES.map((tour) => {
                    const isChecked = selectedTours.includes(tour)
                    return (
                      <button
                        key={tour}
                        type="button"
                        onClick={() => toggleTour(tour)}
                        className={`p-3.5 rounded-xl text-left border text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer ${
                          isChecked
                            ? 'border-[#f64d0b] bg-orange-50/70 text-stone-900'
                            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-[#f64d0b] border-[#f64d0b] text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="line-clamp-2">{tour}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-stone-800">
                    ¿En qué zona o hotel te hospedarás para coordinar tu recogida?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DESTINATIONS.map((dest) => {
                      const isSelected = selectedDestination === dest.label
                      return (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => setSelectedDestination(dest.label)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#f64d0b] border-[#f64d0b] text-white'
                              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {dest.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SERVICIO 3: CRUCEROS POR EL CARIBE */}
            {selectedService === 'cruise' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal flex items-center gap-2">
                    <Ship className="w-5 h-5 text-[#f64d0b]" />
                    <span>Selecciona la ruta de crucero de tu interés:</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Itinerarios reales con salidas programadas en el Caribe:
                  </p>
                </div>

                <div className="space-y-3">
                  {REAL_CRUISES.map((route) => {
                    const isSelected = selectedCruise === route.label
                    return (
                      <button
                        key={route.id}
                        type="button"
                        onClick={() => setSelectedCruise(route.label)}
                        className={`w-full p-4 rounded-xl text-left border text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#f64d0b] bg-orange-50 text-stone-900 ring-2 ring-[#f64d0b]/20'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <div>
                          <p>{route.label}</p>
                          <p className="text-[11px] font-normal text-stone-500 mt-0.5">{route.note}</p>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-[#f64d0b] shrink-0 ml-3" />}
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-stone-800">
                    Tipo de camarote sugerido:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CABIN_TYPES.map((cabin) => {
                      const isSelected = selectedCabin === cabin.label
                      return (
                        <button
                          key={cabin.id}
                          type="button"
                          onClick={() => setSelectedCabin(cabin.label)}
                          className={`p-3 rounded-xl text-left border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#f64d0b] bg-orange-50 text-stone-900'
                              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <span>{cabin.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#f64d0b] shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#f64d0b] hover:bg-[#d43d06] text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Continuar a Fechas & Pasajeros</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 3: FECHAS Y PASAJEROS */}
        {/* ============================================================ */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                ¿En qué fechas planeas viajar y cuántas personas van?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Nos permite consultar tarifas exactas de temporada y promociones vigentes:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Fechas / Mes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#f64d0b]" />
                  <span>Fechas tentativas o mes de viaje:</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Del 20 al 23 de Noviembre / En Navidad"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900"
                />
              </div>

              {/* Noches de estadía (solo para hoteles) */}
              {selectedService === 'hotel' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-[#f64d0b]" />
                    <span>Noches estimadas en el resort:</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 7].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNights(n)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          nights === n
                            ? 'border-[#f64d0b] bg-[#f64d0b] text-white shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {n} {n === 7 ? 'Semana' : 'Noches'}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col justify-end">
                  <p className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                    ℹ️ Las tarifas de {selectedService === 'tour' ? 'excursiones' : 'cruceros'} se calculan por persona según la fecha elegida.
                  </p>
                </div>
              )}
            </div>

            {/* Contadores de Pasajeros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
              {/* Adultos */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Adultos</h4>
                  <p className="text-xs text-stone-500">12 años en adelante</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-base text-stone-900">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults((prev) => prev + 1)}
                    className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Niños */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Niños</h4>
                  <p className="text-xs text-stone-500">Menores de 11 años</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                    className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-base text-stone-900">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren((prev) => prev + 1)}
                    className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#f64d0b] hover:bg-[#d43d06] text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Revisar Resumen y Cotizar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 4: DATOS DE CONTACTO Y RESUMEN FINAL */}
        {/* ============================================================ */}
        {step === 4 && (
          <form onSubmit={handleWhatsAppSubmit} className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario de Contacto */}
              <div className="lg:col-span-2 space-y-5">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                    ¿A quién enviamos la cotización?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Ingresa tus datos para coordinar las opciones y tarifas disponibles:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Tu Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. María Gómez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">WhatsApp / Teléfono *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. +1 (809) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Correo Electrónico (Opcional)</label>
                  <input
                    type="email"
                    placeholder="tuemail@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Comentarios o preferencias especiales (Opcional)</label>
                  <textarea
                    rows={3}
                    placeholder="Ej. Habitación familiar frente a la piscina, preferimos tour por la mañana, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900 resize-none"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-emerald-900 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Sin tarifas ocultas. Atención directa por asesores de Soleando en WhatsApp.</span>
                </div>
              </div>

              {/* Ficha Resumen en Tiempo Real */}
              <div className="lg:col-span-1">
                <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md space-y-5 sticky top-24">
                  <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#fadc40]">
                      Resumen del Plan
                    </span>
                    <span className="text-[11px] text-stone-400">Soleando DR</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Servicio</span>
                      <strong className="text-white text-sm">
                        {SERVICES.find((s) => s.id === selectedService)?.title}
                      </strong>
                    </div>

                    {selectedService === 'hotel' && (
                      <>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Destino</span>
                          <span className="text-stone-200">{selectedDestination}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Estilo</span>
                          <span className="text-stone-200">{hotelStyle}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Estadía</span>
                          <span className="text-stone-200">{nights} noches</span>
                        </div>
                        {preferredHotel && (
                          <div>
                            <span className="text-stone-400 block text-[11px]">Hotel preferido</span>
                            <span className="text-stone-200">{preferredHotel}</span>
                          </div>
                        )}
                      </>
                    )}

                    {selectedService === 'tour' && (
                      <>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Tours seleccionados</span>
                          <span className="text-stone-200">{selectedTours.length} excursión(es)</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Zona de recogida</span>
                          <span className="text-stone-200">{selectedDestination}</span>
                        </div>
                      </>
                    )}

                    {selectedService === 'cruise' && (
                      <>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Ruta</span>
                          <span className="text-stone-200">{selectedCruise}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Camarote</span>
                          <span className="text-stone-200">{selectedCabin}</span>
                        </div>
                      </>
                    )}

                    <div>
                      <span className="text-stone-400 block text-[11px]">Viajeros</span>
                      <span className="text-stone-200">
                        {adults} Adulto(s){children > 0 ? `, ${children} Niño(s)` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Fechas estimadas</span>
                      <span className="text-stone-200">{dates || 'Por coordinar'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <WhatsappIcon className="w-4 h-4 text-white" />
                      <span>Cotizar por WhatsApp Ahora</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Paso 3</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
