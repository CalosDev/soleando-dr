import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { WhatsappIcon } from '@/components/icons'

export function ValueBentoGrid() {
  return (
    <section className="py-20 lg:py-28 bg-[#fdfbf7] content-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#f64d0b] bg-orange-50 border border-orange-200/60 font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>La diferencia Soleando</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
            Viajar con nosotros se siente<br />
            <em className="text-[#f64d0b] italic font-serif">como tener amigos locales en la isla.</em>
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto">
            Combinamos la rapidez de una plataforma moderna con el respaldo humano y cálido de un equipo que vive y respira República Dominicana.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Bento Item 1: Large Featured Card (2 columns on desktop) */}
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[380px] shadow-lg group">
            {/* Background Image with Dark Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/soleando-beach.png"
                alt="Playa de República Dominicana con Soleando"
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/70 to-transparent" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f64d0b] text-white shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-white" />
                <span>Especialistas en Destino</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                Punta Cana • Bayahíbe • Samaná • Cap Cana
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3 max-w-xl">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-snug">
                Conocemos cada rincón, resort y playa de primera mano.
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                No usamos catálogos impersonales comprados a terceros. Nuestro equipo reside en República Dominicana: sabemos qué resort renovó sus instalaciones, cuál playa tiene el mar más sereno para niños y cuáles excursiones valen realmente cada dólar.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#fadc40]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#fadc40]" />
                  <span>Inspección presencial de hoteles</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#fadc40]" />
                  <span>Guías certificados oficiales</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bento Item 2: WhatsApp Concierge Simulator (1 column) */}
          <div className="md:col-span-1 rounded-3xl bg-white border border-[#ede8e1] p-6 sm:p-8 flex flex-col justify-between shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center border border-emerald-100">
                <WhatsappIcon className="w-6 h-6 fill-current text-[#25D366]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-snug">
                Atención 1 a 1 en tiempo real
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Sin contestadores automáticos ni tickets lentos. Hablas directo por WhatsApp con tu asesor asignado.
              </p>
            </div>

            {/* Simulated WhatsApp Chat Bubble */}
            <div className="bg-[#e5ddd5]/30 rounded-2xl p-4 border border-stone-200/70 space-y-2.5 text-xs">
              <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-2xs text-stone-800 space-y-1">
                <p className="font-medium leading-snug">
                  «¡Hola Soleando! Nuestro vuelo se retrasó 1 hora, ¿el transporte nos espera?»
                </p>
                <span className="text-[10px] text-stone-400 block text-right">14:15</span>
              </div>

              <div className="bg-[#dcf8c6] p-3 rounded-2xl rounded-tr-xs shadow-2xs text-stone-900 ml-4 space-y-1">
                <p className="font-medium leading-snug">
                  «¡Tranquila Sofía! Ya monitoreamos el vuelo y avisamos a tu chofer en Punta Cana. Te esperan con cartel en la salida 🚐🌴»
                </p>
                <span className="text-[10px] text-emerald-700 block text-right font-semibold">14:17 • Leído</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Respuesta promedio: menos de 10 minutos</span>
            </div>
          </div>

          {/* Bento Item 3: Transparency & No Surprise Fees (1 column) */}
          <div className="md:col-span-1 rounded-3xl bg-white border border-[#ede8e1] p-6 sm:p-8 flex flex-col justify-between shadow-xs space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center border border-orange-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-snug">
                Tarifas claras, sin sorpresas
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                El precio cotizado es el precio final. No agregamos impuestos ocultos ni tasas sorpresa al llegar a recepción o abordar las lanchas.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Impuestos de parques nacionales incluidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Seguro médico de accidentes en tours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cancelación flexible hasta 24h antes</span>
              </div>
            </div>
          </div>

          {/* Bento Item 4: Direct Agreements & All-inclusive Resorts (2 columns) */}
          <div className="md:col-span-2 rounded-3xl bg-[#f5f1ea] border border-[#ede8e1] p-8 sm:p-10 flex flex-col justify-between shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-stone-800 bg-white border border-[#ede8e1]">
                <span>Alianzas oficiales</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal leading-tight">
                Convenios directos con las cadenas más prestigiosas del Caribe
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
                Al trabajar sin capas infinitas de subintermediarios, gestionamos tarifas preferenciales, confirmaciones inmediatas y peticiones especiales de habitaciones (pisos altos, camas king, detalles para luna de miel o aniversarios).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ede8e1]/80 shadow-2xs">
                <span className="text-xs font-bold text-stone-900 block">Resorts 5★</span>
                <span className="text-[11px] text-stone-500">Todo Incluido</span>
              </div>
              <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ede8e1]/80 shadow-2xs">
                <span className="text-xs font-bold text-stone-900 block">Catamaranes VIP</span>
                <span className="text-[11px] text-stone-500">Saona & Catalina</span>
              </div>
              <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ede8e1]/80 shadow-2xs">
                <span className="text-xs font-bold text-stone-900 block">Cruceros</span>
                <span className="text-[11px] text-stone-500">Rutas sin visa</span>
              </div>
              <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ede8e1]/80 shadow-2xs">
                <span className="text-xs font-bold text-stone-900 block">Traslados VIP</span>
                <span className="text-[11px] text-stone-500">Climatizados</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#f64d0b] hover:text-[#d43d06] transition-colors"
              >
                <span>Solicitar una cotización a medida</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
