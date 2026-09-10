import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { siteConfig } from '@/config/site'
import { Heart, Sun, MapPin, Users } from 'lucide-react'
import { WhatsappIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Soleando DR',
  description: 'Conoce la historia, el equipo y la visión de Soleando DR, tu plataforma de viajes y hoteles en el Caribe.',
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1">
        {/* Hero Nosotros */}
        <section className="relative text-white pt-20 pb-28 sm:pt-28 sm:pb-36 px-4 sm:px-6 lg:px-8 text-center space-y-5 overflow-hidden">
          {/* Imagen de fondo con tono oscuro uniforme */}
          <div className="absolute inset-0 z-0 bg-stone-950">
            <Image
              src="/ViveSolenado.jpg"
              alt="Sobre Nosotros - Soleando DR"
              fill
              className="object-cover object-center brightness-50 contrast-105"
              priority
            />
            {/* Overlay uniforme para tono oscuro sin franjas */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>

          
          <h1 className="relative z-10 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight max-w-3xl mx-auto text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            <em className="text-[#fadc40] italic font-serif">Soleando DR</em>
          </h1>
          <p className="relative z-10 text-white font-medium max-w-xl mx-auto text-sm sm:text-base leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Nacimos con una idea clara: conectar a los viajeros con lo mejor de República Dominicana a través de una atención cercana, honesta y sin complicaciones.
          </p>
        </section>

        {/* Historia & Manifiesto */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-xl border border-[#ede8e1] bg-white">
              <Image
                src="/igexport-DM0ilWduUhR.jpg"
                alt="Paisaje tropical de Soleando"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f64d0b]">
                Pasión por nuestro país
              </span>
              <h2 className="font-serif text-3xl text-stone-900 font-normal leading-snug">
                Más que una agencia, tus aliados de viaje.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Creemos que los mejores recuerdos no se planean demasiado. Se encuentran en una playa escondida, en una conversación en el barco y en ese momento exacto en que el sol toca el horizonte.
              </p>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Hoy evolucionamos hacia una plataforma integral de reservas hoteleras y experiencias, manteniendo siempre lo que nos hace únicos: el trato cálido y la recomendación sincera.
              </p>
            </div>
          </div>

          {/* Valores Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#ede8e1]">
            <div className="space-y-2 p-6 rounded-3xl bg-white border border-[#ede8e1]">
              <Heart className="w-6 h-6 text-[#f64d0b]" />
              <h3 className="font-serif text-lg text-stone-900 font-normal">Trato Humano</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Detrás de cada pantalla hay personas reales dispuestas a ayudarte a que tu viaje salga perfecto.
              </p>
            </div>
            <div className="space-y-2 p-6 rounded-3xl bg-white border border-[#ede8e1]">
              <MapPin className="w-6 h-6 text-[#f64d0b]" />
              <h3 className="font-serif text-lg text-stone-900 font-normal">Criterio Local</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Conocemos cada rincón, resort y playa porque vivimos y respiramos República Dominicana.
              </p>
            </div>
            <div className="space-y-2 p-6 rounded-3xl bg-white border border-[#ede8e1]">
              <Users className="w-6 h-6 text-[#f64d0b]" />
              <h3 className="font-serif text-lg text-stone-900 font-normal">Viajeros Felices</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tu descanso y tranquilidad son nuestra mayor prioridad desde el primer mensaje hasta tu regreso a casa.
              </p>
            </div>
          </div>

          {/* CTA WhatsApp */}
          <div className="text-center bg-white rounded-3xl p-8 sm:p-12 border border-[#ede8e1] space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 font-normal">
              ¿Listo para planear tu próxima escapada?
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Escríbenos directamente y un asesor de Soleando te guiará paso a paso.
            </p>
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#f64d0b] text-white font-bold text-sm shadow-md hover:bg-[#e04408] transition-all"
            >
              <WhatsappIcon className="w-4 h-4 text-white" />
              <span>Conversar con nosotros</span>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
