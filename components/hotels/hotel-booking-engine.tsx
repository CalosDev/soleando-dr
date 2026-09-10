'use client'

import { useEffect, useState } from 'react'
import { LoaderCircle, ShieldCheck } from 'lucide-react'

const vendorEngineUrl = 'https://www.grupogonzalez.com.do/es/microsite/soleandord#bmTabhotel-pane'

/**
 * Loads the supplier-hosted microsite at its hotel form anchor. Keeping the
 * vendor origin is required for its destination autocomplete requests.
 */
export function HotelBookingEngine() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Keep a fallback for browsers that delay the cross-origin load event.
    const timeout = window.setTimeout(() => setLoaded(true), 1800)
    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <section id="buscar-hoteles" className="hotel-engine-shell" aria-label="Motor seguro de búsqueda de hoteles">
      <div className="hotel-engine-heading">
        <div>
          <p className="hotel-engine-eyebrow">Disponibilidad en vivo</p>
          <h2>Encuentra y reserva tu hotel</h2>
        </div>
        <p><ShieldCheck aria-hidden="true" /> La búsqueda y el pago se completan en el entorno seguro del proveedor.</p>
      </div>
      <div className="hotel-engine-frame-wrap" aria-busy={!loaded}>
        {!loaded && <div className="hotel-engine-loading"><LoaderCircle aria-hidden="true" /><span>Cargando buscador seguro…</span></div>}
        <iframe
          title="Buscador de hoteles de Soleando"
          className="hotel-engine-frame"
          src={vendorEngineUrl}
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </section>
  )
}
