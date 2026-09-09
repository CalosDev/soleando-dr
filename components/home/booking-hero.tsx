import Image from 'next/image'
import { HotelSearchForm } from './hotel-search-form'
import { ShieldCheck, MessageCircle, MapPin } from 'lucide-react'

export function BookingHero() {
  return (
    <section className="relative z-20 min-h-[640px] lg:min-h-[720px] flex items-center justify-center pt-24 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Image with isolated overflow-hidden */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/soleando-hero.webp"
          alt="Playas paradisíacas de República Dominicana"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center scale-105"
        />
        {/* Layered Tropical Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8">
        {/* Tagline / Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/20">
          <span className="w-2 h-2 rounded-full bg-[#fadc40] animate-pulse" />
          <span>Hoteles & Experiencias en el Caribe</span>
        </div>

        {/* H1 Principal Oficial */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-normal leading-[1.05] tracking-tight">
            Tu próximo viaje<br />
            <em className="text-[#fadc40] not-italic italic font-serif">empieza aquí.</em>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-stone-200 font-sans max-w-2xl mx-auto font-normal leading-relaxed">
            Encuentra hoteles, resorts todo incluido y experiencias seleccionadas para vivir República Dominicana a tu manera.
          </p>
        </div>

        {/* Formulario de Búsqueda Principal */}
        <div className="pt-2">
          <HotelSearchForm />
        </div>

        {/* Quick Highlights / Trust badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-stone-200 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#fadc40]" />
            <span>Reserva segura y transparente</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#fadc40]" />
            <span>Asistencia 1 a 1 por WhatsApp</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#fadc40]" />
            <span>Expertos locales en RD</span>
          </div>
        </div>
      </div>
    </section>
  )
}
