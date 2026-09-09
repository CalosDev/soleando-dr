'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { WhatsappIcon } from '@/components/icons'
import { X, MessageCircle } from 'lucide-react'

export function FloatingWhatsApp() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [hasDismissed, setHasDismissed] = useState(false)

  // Do not show on administrative routes
  if (pathname.startsWith('/admin')) {
    return null
  }

  // Determine context message based on page
  let prefilledMessage = '¡Hola Soleando DR! Me gustaría recibir información y asesoría para mi viaje.'
  let contextualBadge = 'Asesor en línea'

  if (pathname.startsWith('/hoteles')) {
    prefilledMessage = '¡Hola Soleando DR! Estoy viendo hoteles en la web y me gustaría cotizar una estadía.'
    contextualBadge = 'Cotizaciones de hoteles'
  } else if (pathname.startsWith('/experiencias')) {
    prefilledMessage = '¡Hola Soleando DR! Me interesan las excursiones y experiencias. ¿Tienen fechas y disponibilidad?'
    contextualBadge = 'Tours & excursiones'
  } else if (pathname.startsWith('/cruceros')) {
    prefilledMessage = '¡Hola Soleando DR! Quisiera consultar sobre las salidas de cruceros por el Caribe.'
    contextualBadge = 'Cruceros por el Caribe'
  }

  const encodedUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(prefilledMessage)}`
  const isDetailPage = /^\/(hoteles|experiencias)\/[^/]+$/.test(pathname)

  return (
    <aside
      aria-label="Asistencia por WhatsApp"
      className={`fixed bottom-5 right-5 z-40 flex-col items-end gap-2.5 print:hidden ${
        isDetailPage ? 'hidden lg:flex' : 'flex'
      }`}
    >
      {/* Floating Prompt Bubble (can be dismissed) */}
      {!hasDismissed && (
        <div
          role="region"
          aria-label="Mensaje de bienvenida"
          className="relative bg-white text-stone-900 px-4 py-3 rounded-2xl shadow-xl border border-stone-200/80 max-w-[280px] sm:max-w-xs transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <button
            type="button"
            onClick={() => setHasDismissed(true)}
            aria-label="Cerrar mensaje de bienvenida"
            className="absolute -top-2 -left-2 w-6 h-6 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center text-xs shadow-xs border border-stone-300 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {contextualBadge}
            </span>
          </div>

          <p className="text-xs text-stone-700 font-medium leading-snug">
            ¿Planeando tu viaje a República Dominicana? Chatea con un asesor y recibe cotización personalizada.
          </p>

          <div className="mt-2.5 pt-2 border-t border-stone-100 flex justify-end">
            <a
              href={encodedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f64d0b] hover:text-[#d43d06] transition-colors"
            >
              <span>Abrir WhatsApp</span>
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={encodedUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar con un asesor por WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/60 focus:outline-hidden focus:ring-4 focus:ring-emerald-400/50"
      >
        <span className="sr-only">Contactar por WhatsApp</span>

        {/* Pulse ring effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 animate-pulse pointer-events-none" />

        {/* WhatsApp Icon */}
        <WhatsappIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white relative z-10 transition-transform duration-200 group-hover:scale-110" />

        {/* Live indicator dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-[#25D366] rounded-full z-20" />
      </a>
    </aside>
  )
}
