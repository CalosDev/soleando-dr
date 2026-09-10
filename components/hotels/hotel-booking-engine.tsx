'use client'

import { useEffect, useState } from 'react'
import { LoaderCircle, ShieldCheck } from 'lucide-react'

const vendorScripts = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base target="_blank" />
    <script src="https://www.grupogonzalez.com.do/es/microsite/soleandord/engine/v2-scripts"></script>
  </head>
  <body>
    <div id="bmEngine">
      <script src="https://www.grupogonzalez.com.do/es/microsite/soleandord/engine/v2?type=hotel"></script>
    </div>
  </body>
</html>`

/**
 * Runs the supplier's document.write-based engine in an isolated document.
 * This prevents its global CSS and scripts from changing Soleando's React tree.
 */
export function HotelBookingEngine() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // The supplier injects its UI asynchronously with document.write, which
    // does not reliably produce a second iframe load event.
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
          srcDoc={vendorScripts}
          sandbox="allow-forms allow-popups allow-scripts allow-top-navigation-by-user-activation"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </section>
  )
}
