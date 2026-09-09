import { Check, X, AlertTriangle, ShieldCheck } from 'lucide-react'
import { WhatsappIcon } from '@/components/icons'
import { siteConfig } from '@/config/site'

const COMPARISON_ROWS = [
  {
    feature: 'Asistencia 1 a 1 por WhatsApp antes y durante tu estancia',
    soleando: { status: 'check', text: 'Asesor dominicano asignado los 7 días' },
    otas: { status: 'cross', text: 'Chatbots automáticos o tickets por correo' },
    informal: { status: 'warn', text: 'Sin soporte ni respuesta tras cobrar' },
  },
  {
    feature: 'Recomendaciones reales de playas y hoteles (reformas, clima, sargazo)',
    soleando: { status: 'check', text: 'Inspección presencial y consejo honesto' },
    otas: { status: 'cross', text: 'Algoritmos y fotos desactualizadas' },
    informal: { status: 'warn', text: 'Solo ofrecen lo que tienen a mano' },
  },
  {
    feature: 'Gestión de peticiones especiales en el resort (vistas, aniversarios)',
    soleando: { status: 'check', text: 'Coordinación directa con recepción' },
    otas: { status: 'warn', text: 'Nota opcional sin ninguna garantía' },
    informal: { status: 'cross', text: 'No gestionan hoteles ni resorts' },
  },
  {
    feature: 'Seguro médico de accidentes incluido en excursiones',
    soleando: { status: 'check', text: 'Póliza turística y guías certificados' },
    otas: { status: 'warn', text: 'Depende del tercero subcontratado' },
    informal: { status: 'cross', text: 'Sin seguro médico ni respaldo legal' },
  },
  {
    feature: 'Precios finales sin tasas sorpresa ni cobros al abordar',
    soleando: { status: 'check', text: 'Cotización transparente en USD / RD$' },
    otas: { status: 'warn', text: 'Cargos de cambio de divisa y tasas al check-in' },
    informal: { status: 'cross', text: 'Cobros sorpresa al subir a la lancha' },
  },
]

export function ComparisonMatrix() {
  const whatsappUrl = `${siteConfig.whatsappUrl}&text=${encodeURIComponent('Hola Soleando DR, estuve viendo la comparativa en su web y me gustaría recibir asesoría para mi viaje a República Dominicana.')}`

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-[#ede8e1] content-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60 font-sans">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Comparativa transparente</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
            ¿Por qué reservar con Soleando<br />
            <em className="text-stone-700 italic font-serif">en lugar de buscar por tu cuenta?</em>
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto">
            Comparamos con total sinceridad lo que obtienes con nosotros frente a las plataformas masivas o vendedores informales.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto rounded-3xl border border-[#ede8e1] shadow-xs bg-white">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#ede8e1] bg-[#fdfbf7]">
                <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-stone-500 w-2/5">
                  Beneficio / Seguridad
                </th>
                <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-white bg-stone-900 w-1/5 rounded-t-2xl sm:rounded-t-none">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-serif font-normal text-white">Soleando DR</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f64d0b] text-white">
                      Recomendado
                    </span>
                  </div>
                </th>
                <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-stone-600 w-1/5">
                  OTAs Globales <span className="block text-[10px] font-normal text-stone-400">Booking / Expedia</span>
                </th>
                <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-stone-600 w-1/5">
                  Venta Informal <span className="block text-[10px] font-normal text-stone-400">En la playa</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede8e1] text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                  {/* Feature Title */}
                  <td className="py-4 px-6 font-semibold text-stone-800">
                    {row.feature}
                  </td>

                  {/* Soleando DR column (Highlighted) */}
                  <td className="py-4 px-6 bg-stone-900/[0.03] border-x border-[#ede8e1] font-medium text-stone-900">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-xs leading-snug">{row.soleando.text}</span>
                    </div>
                  </td>

                  {/* OTAs Column */}
                  <td className="py-4 px-6 text-stone-600">
                    <div className="flex items-start gap-2">
                      {row.otas.status === 'cross' ? (
                        <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                      <span className="text-xs leading-snug text-stone-500">{row.otas.text}</span>
                    </div>
                  </td>

                  {/* Informal Sellers Column */}
                  <td className="py-4 px-6 text-stone-600">
                    <div className="flex items-start gap-2">
                      {row.informal.status === 'cross' ? (
                        <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                      <span className="text-xs leading-snug text-stone-500">{row.informal.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Conversion Card */}
        <div className="bg-[#f5f1ea] rounded-3xl p-6 sm:p-8 border border-[#ede8e1] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
              ¿Listo para planear tus vacaciones sin complicaciones?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600">
              Cotiza sin compromiso y recibe asesoría gratuita directa con nuestro equipo local.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all hover:scale-102"
          >
            <WhatsappIcon className="w-4 h-4 text-white" />
            <span>Hablar con un asesor en WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  )
}
