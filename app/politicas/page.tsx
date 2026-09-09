import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { siteConfig } from '@/config/site'
import { ShieldCheck, Calendar, FileText, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Políticas de Reserva, Cancelación y Privacidad | Soleando DR',
  description:
    'Conoce nuestras políticas claras y transparentes sobre cancelaciones, reembolsos, condiciones de reserva y protección de datos en Soleando DR.',
}

export default function PoliticasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-stone-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#fadc40]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparencia & Confianza</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal">
            Políticas y Términos de Servicio
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base">
            En Soleando DR operamos con total claridad para que viajes con absoluta tranquilidad. Aquí encontrarás nuestras condiciones de reserva, cancelación y manejo de datos.
          </p>
        </section>

        {/* Contenido Estructurado */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
          {/* Sección 1: Cancelación y Reembolso */}
          <article id="cancelaciones" className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  1. Políticas de Cancelación y Reembolsos
                </h2>
                <span className="text-xs text-stone-500">Actualizado para la temporada 2026</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
              <h3 className="text-base font-bold text-stone-900">Excursiones y Tours de un Día</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Cancelación con más de 48 horas de antelación:</strong> Reembolso del 100% del monto abonado o cambio de fecha sin penalización.
                </li>
                <li>
                  <strong>Cancelación entre 24 y 48 horas antes de la salida:</strong> Se retiene un 30% por concepto de gastos operativos y logísticos de transporte.
                </li>
                <li>
                  <strong>Cancelación con menos de 24 horas o No Show (no presentación):</strong> No aplica reembolso debido a que el transporte y los accesos a parques nacionales ya han sido bloqueados y pagados con el proveedor local.
                </li>
              </ul>

              <h3 className="text-base font-bold text-stone-900 pt-2">Cancelaciones por Condiciones Meteorológicas (Fuerza Mayor)</h3>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Si la <strong>Armada de República Dominicana</strong> o el <strong>Centro de Operaciones de Emergencias (COE)</strong> emite prohibición de zarpe o alerta climática que impida la realización segura de una actividad marítima (como Isla Saona o Cayo Levantado), el cliente podrá elegir entre <strong>reprogramar la actividad para otra fecha disponible durante su estancia</strong> o solicitar el <strong>reembolso total</strong> de la excursión afectada.
                </p>
              </div>

              <h3 className="text-base font-bold text-stone-900 pt-2">Hoteles y Resorts</h3>
              <p>
                Las políticas de cancelación y penalidad para reservas hoteleras se rigen por las condiciones particulares de cada cadena o resort (temporada baja, media o alta). Antes de formalizar tu pago, nuestro equipo te informará por escrito la fecha límite de cancelación gratuita estipulada por la propiedad.
              </p>
            </div>
          </article>

          {/* Sección 2: Términos y Condiciones */}
          <article id="terminos" className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  2. Términos y Condiciones del Servicio
                </h2>
                <span className="text-xs text-stone-500">Soleando DR — Agencia de Viajes y Turismo</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
              <ul className="list-disc pl-5 space-y-2.5">
                <li>
                  <strong>Identificación requerida:</strong> Es responsabilidad del pasajero portar su documento de identidad válido (cédula de identidad para dominicanos o pasaporte vigente para extranjeros) durante los traslados y el check-in en hoteles.
                </li>
                <li>
                  <strong>Puntualidad en traslados:</strong> Los horarios de recogida en el lobby de los hoteles tienen un margen de cortesía de 10 a 15 minutos. El pasajero debe encontrarse listo en el lobby principal a la hora notificada.
                </li>
                <li>
                  <strong>Vouchers y Confirmaciones:</strong> Una vez liquidado el abono o el balance total, el viajero recibirá su confirmación oficial con código de reserva, voucher digital y contacto directo del coordinador asignado.
                </li>
                <li>
                  <strong>Conducta y Seguridad:</strong> Por regulaciones turísticas, los pasajeros deben respetar las normativas de seguridad marítima (uso obligatorio de chaleco salvavidas en embarcaciones) y las indicaciones del personal certificado.
                </li>
              </ul>
            </div>
          </article>

          {/* Sección 3: Privacidad */}
          <article id="privacidad" className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  3. Política de Privacidad y Protección de Datos
                </h2>
                <span className="text-xs text-stone-500">Conforme a la Ley No. 172-13 de Protección de Datos en RD</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
              <p>
                En <strong>Soleando DR</strong> valoramos y protegemos la confidencialidad de tu información personal.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Datos recopilados:</strong> Solo solicitamos nombres, correos electrónicos, números de WhatsApp y fechas de viaje estrictamente necesarios para procesar tus reservas y emitir tus vouchers turísticos.
                </li>
                <li>
                  <strong>No divulgación a terceros:</strong> No vendemos, alquilamos ni transferimos tus datos a empresas externas de publicidad. La información solo se comparte con los operadores y hoteles contratados para hacer efectiva tu reserva.
                </li>
                <li>
                  <strong>Comunicaciones:</strong> Solo te enviaremos información relevante sobre tus reservas activas o cotizaciones solicitadas. Puedes solicitar la supresión o actualización de tus datos en cualquier momento escribiendo a nuestros canales oficiales.
                </li>
              </ul>
            </div>
          </article>

          {/* Contacto para Dudas Legales */}
          <div className="text-center p-8 bg-stone-100 rounded-3xl space-y-3">
            <h3 className="font-serif text-xl text-stone-900 font-normal">
              ¿Tienes alguna pregunta sobre nuestras políticas?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Estamos a tu disposición para aclarar cualquier duda antes o después de contratar tu viaje.
            </p>
            <div className="pt-2">
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold transition-colors"
              >
                <span>Hablar con Atención al Cliente</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
