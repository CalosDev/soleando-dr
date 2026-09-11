'use client'

import { useState } from 'react'
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { WhatsappIcon } from '@/components/icons'

interface FaqItem {
  id: string
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    question: '¿Cómo funciona la búsqueda y reserva de hoteles?',
    answer:
      'Indica el destino, las fechas y los viajeros en nuestro buscador. Soleando consulta la disponibilidad del proveedor hotelero y te dirige a su entorno para completar la reserva con las condiciones vigentes.',
  },
  {
    id: '2',
    question: '¿Dónde se completa el pago del hotel?',
    answer:
      'La selección final y el pago se completan en el entorno seguro del proveedor. Allí verás el precio, las condiciones de la tarifa y la política de cancelación antes de confirmar.',
  },
  {
    id: '3',
    question: '¿Cómo consulto tours, excursiones o cruceros?',
    answer:
      'El catálogo público muestra únicamente las opciones publicadas por Soleando. Puedes abrir cada detalle y enviar una consulta por WhatsApp para confirmar fechas, disponibilidad y condiciones.',
  },
  {
    id: '4',
    question: '¿Puedo pedir ayuda antes de reservar?',
    answer:
      'Sí. Escríbenos por WhatsApp con tus fechas, número de viajeros y preferencias. El equipo podrá orientarte antes de que completes una reserva.',
  },
]

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id)

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="py-20 lg:py-24 bg-[#fdfbf7] content-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Respuestas Claras</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
            Información clara sobre el buscador de hoteles y el catálogo administrado por Soleando.
          </p>
        </div>

        {/* Acordeón de FAQs */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs transition-all duration-200 hover:border-stone-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#f64d0b]/40 rounded-2xl"
                >
                  <span className="font-serif text-base sm:text-lg text-stone-900 font-medium">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-[#f64d0b] text-white rotate-180' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Banner de Ayuda Directa */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-normal">
              ¿Tienes una duda específica sobre tu viaje?
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm">
              Escríbenos por WhatsApp y el equipo dará seguimiento a tu consulta.
            </p>
          </div>

          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
          >
            <WhatsappIcon className="w-4 h-4 text-white" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  )
}
