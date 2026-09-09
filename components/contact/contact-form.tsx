'use client'

import { useState } from 'react'
import { siteConfig } from '@/config/site'
import { WhatsappIcon } from '@/components/icons'
import { Send, CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'hotel',
    dates: '',
    guests: '2 personas',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const serviceLabels: Record<string, string> = {
      hotel: 'Reserva de Hotel / Resort',
      tour: 'Excursión / Tour',
      cruise: 'Crucero por el Caribe',
      group: 'Viaje en Grupo / Evento',
      other: 'Otra consulta',
    }

    const text = `*Nueva Consulta desde la Web Soleando DR*
*Nombre:* ${formData.name}
*Teléfono / WhatsApp:* ${formData.phone || 'No especificado'}
*Email:* ${formData.email || 'No especificado'}
*Servicio de Interés:* ${serviceLabels[formData.service] || formData.service}
*Fechas tentativas:* ${formData.dates || 'Por definir'}
*Pasajeros:* ${formData.guests}
*Detalles:* ${formData.message}`

    const url = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-xs text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl text-stone-900 font-normal">
          ¡Consulta generada con éxito!
        </h3>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Se ha abierto WhatsApp con los datos de tu viaje para que un asesor te responda de inmediato con tarifas y opciones disponibles.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="inline-block mt-4 text-xs font-bold text-[#f64d0b] hover:underline"
        >
          Enviar otra consulta
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xs space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
          Envíanos tu Solicitud de Viaje
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Completa el formulario y te prepararemos una propuesta a medida sin ningún compromiso.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nombre */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-bold text-stone-700">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="name"
            required
            placeholder="Ej. Juan Pérez"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900 transition-colors"
          />
        </div>

        {/* Teléfono / WhatsApp */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-bold text-stone-700">
            WhatsApp / Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            required
            placeholder="Ej. +1 (809) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-stone-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            placeholder="tuemail@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900 transition-colors"
          />
        </div>

        {/* Tipo de Servicio */}
        <div className="space-y-1.5">
          <label htmlFor="service" className="text-xs font-bold text-stone-700">
            ¿Qué deseas cotizar? *
          </label>
          <select
            id="service"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900 transition-colors bg-white"
          >
            <option value="hotel">Reserva de Hotel / Resort</option>
            <option value="tour">Excursión o Tour de un Día</option>
            <option value="cruise">Crucero por el Caribe</option>
            <option value="group">Viaje en Grupo / Evento Privado</option>
            <option value="other">Otra consulta</option>
          </select>
        </div>

        {/* Fechas */}
        <div className="space-y-1.5">
          <label htmlFor="dates" className="text-xs font-bold text-stone-700">
            Fechas Tentativas o Mes de Viaje
          </label>
          <input
            type="text"
            id="dates"
            placeholder="Ej. Del 15 al 18 de Octubre"
            value={formData.dates}
            onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900 transition-colors"
          />
        </div>

        {/* Pasajeros */}
        <div className="space-y-1.5">
          <label htmlFor="guests" className="text-xs font-bold text-stone-700">
            Número de Viajeros
          </label>
          <input
            type="text"
            id="guests"
            placeholder="Ej. 2 adultos y 1 niño"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900 transition-colors"
          />
        </div>
      </div>

      {/* Mensaje */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-bold text-stone-700">
          Mensaje o Preferencias (hotel preferido, presupuesto, etc.)
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="Cuéntanos más sobre lo que buscas para ofrecerte la mejor recomendación..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f64d0b] focus:ring-2 focus:ring-[#f64d0b]/20 outline-hidden text-sm text-stone-900 transition-colors resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#f64d0b] hover:bg-[#d43d06] text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
        >
          <WhatsappIcon className="w-4 h-4 text-white" />
          <span>Solicitar Cotización por WhatsApp</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}
