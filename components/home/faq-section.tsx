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
    question: '¿Cómo funciona la reserva y qué métodos de pago aceptan?',
    answer:
      'Reservar con Soleando es directo y transparente. Aceptamos transferencias bancarias en pesos dominicanos (DOP) o dólares (USD) a través de Banco Popular, BHD y Banreservas, así como pagos con tarjetas de crédito y débito nacionales e internacionales. Para bloquear tu habitación o cupo de excursión se solicita un abono inicial y el saldo restante se liquida antes del inicio del servicio.',
  },
  {
    id: '2',
    question: '¿Las excursiones incluyen transporte y recogida en el hotel?',
    answer:
      'Sí, la mayoría de nuestras experiencias incluyen transporte ida y vuelta en vehículos climatizados y autorizados por el Ministerio de Turismo (MITUR). Realizamos recogidas en los lobbies de los principales hoteles de Punta Cana, Bávaro, Cap Cana, Uvero Alto, Bayahíbe, La Romana y Santo Domingo. La hora exacta de recogida te la confirmamos vía WhatsApp un día antes del tour.',
  },
  {
    id: '3',
    question: '¿Qué ocurre si hay mal tiempo o lluvia el día de mi excursión marítima?',
    answer:
      'La seguridad de nuestros viajeros es la prioridad absoluta. Las salidas marítimas (como Isla Saona o Cayo Levantado) están sujetas a las disposiciones de la Armada Dominicana y el COE. Si se declara bandera roja o alerta marítima, reprogramamos tu tour sin penalidad para otro día de tus vacaciones, o aplicamos reembolso según las políticas de cancelación.',
  },
  {
    id: '4',
    question: '¿Los precios publicados tienen cargos ocultos o impuestos adicionales?',
    answer:
      'No. En Soleando creemos en la transparencia total. Las tarifas de hoteles todo incluido contemplan impuestos hoteleros y cargos por servicio aplicables. En las excursiones especificamos con absoluta claridad lo que está incluido (guía oficial, chalecos, almuerzo típico, bebidas, entradas a parques nacionales) y cualquier gasto opcional (como fotos profesionales o propinas).',
  },
  {
    id: '5',
    question: '¿Puedo armar un paquete personalizado que combine hotel, traslados y excursiones?',
    answer:
      '¡Totalmente! Es una de nuestras especialidades. Cuéntale a nuestros asesores por WhatsApp tus fechas, número de personas (adultos y niños) y el estilo de viaje que deseas. Te diseñamos un paquete a medida con tarifas combinadas preferenciales y asistencia personalizada durante toda tu estadía.',
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
            Resolvemos tus dudas más habituales sobre reservas, traslados, métodos de pago y políticas de viaje.
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
              Nuestros asesores locales en República Dominicana te responden en minutos.
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
