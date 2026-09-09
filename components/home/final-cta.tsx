import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { WhatsappIcon, ArrowUpRightIcon } from '@/components/icons'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-[#1c1917] text-white content-auto">
      {/* Background SVG illustration with smooth overlay */}
      <div className="absolute inset-0 z-0 opacity-25">
        <Image
          src="/alghozy-3FmAo4JBvLM-unsplash.svg"
          alt="Textura caribeña"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917] via-[#1c1917]/90 to-[#1c1917]/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#fadc40] text-xs font-bold uppercase tracking-widest border border-white/10">
          Asesoría personalizada sin costo
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08] tracking-tight">
          ¿No sabes qué destino elegir?<br />
          <em className="text-[#fadc40] italic font-serif">Te ayudamos a planearlo.</em>
        </h2>

        <p className="text-base sm:text-lg text-stone-300 max-w-xl mx-auto leading-relaxed">
          Cuéntanos con quién viajas, tus fechas tentativas y tu presupuesto. Te enviamos opciones de hoteles y tours seleccionados directo a tu WhatsApp.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#f64d0b] text-white font-bold text-sm shadow-xl hover:bg-[#e04408] transition-all transform hover:-translate-y-0.5 animate-shimmer"
          >
            <WhatsappIcon className="w-5 h-5 text-white" />
            <span>Hablar con un asesor Soleando</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5 text-white" />
          </a>
        </div>
      </div>
    </section>
  )
}
