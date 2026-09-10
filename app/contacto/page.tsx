import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { siteConfig } from '@/config/site'
import { MessageSquare, MapPin, Mail } from 'lucide-react'
import { WhatsappIcon, InstagramOutlineIcon, ArrowUpRightIcon } from '@/components/icons'
import { InteractiveQuotePlanner } from '@/components/contact/interactive-quote-planner'

export const metadata: Metadata = {
  title: 'Contacto y Cotizaciones | Soleando DR',
  description: 'Planifica y cotiza tu viaje en República Dominicana: hoteles todo incluido, excursiones y cruceros con Soleando DR.',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <SiteHeader variant="solid" />

      <main className="flex-1">
        {/* Banner Superior */}
        <section className="relative text-white py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/alghozy-3FmAo4JBvLM-unsplash.svg"
              alt="Contacto Soleando DR"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 space-y-4 mt-8">
            
            <h1 className="font-serif text-4xl sm:text-6xl font-normal drop-shadow-lg">
              Hablemos de tu viaje
            </h1>
            <p className="text-white/95 max-w-xl mx-auto text-base sm:text-lg drop-shadow-md font-medium leading-relaxed">
              ¿Tienes dudas sobre un hotel, disponibilidad o fechas? Escríbenos directamente y te responderemos a la brevedad.
            </p>
          </div>
        </section>

        {/* Canales de Contacto y Planificador */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {/* Planificador Interactivo de Viaje */}
          <InteractiveQuotePlanner />

          {/* Canales Directos Rápidos */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 font-normal text-center sm:text-left">
              ¿Prefieres atención directa e inmediata?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Canal WhatsApp */}
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-3xl p-8 border border-[#ede8e1] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <WhatsappIcon className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  WhatsApp Directo
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Canal de atención principal para cotizaciones inmediatas, consultas de tarifas y reservas.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:text-emerald-700">
                <span>Escríbenos ahora</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* Canal Instagram Social */}
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-3xl p-8 border border-[#ede8e1] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center border border-orange-100">
                  <InstagramOutlineIcon className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl text-stone-900 font-normal">
                  Instagram Oficial
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Síguenos para descubrir fotos de resorts, inspiración de destinos caribeños y novedades.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-bold text-[#f64d0b] group-hover:text-[#d43d06]">
                <span>{siteConfig.instagramHandle}</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>

        {/* Información adicional */}
          <div className="bg-white rounded-3xl p-8 border border-[#ede8e1] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <MapPin className="w-6 h-6 text-[#f64d0b]" />
              </div>
              <a className="group flex flex-col justify-center" href={siteConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <div>
                  <strong className="text-stone-900 block text-base font-serif font-normal group-hover:text-[#f64d0b]">Ubicación</strong>
                  <span className="text-xs text-stone-500">{siteConfig.location}</span>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Mail className="w-6 h-6 text-[#f64d0b]" />
              </div>
              <div>
                <strong className="text-stone-900 block text-base font-serif font-normal">Horario de Atención</strong>
                <span className="text-xs text-stone-500">Lunes a Sábado · 9:00 AM - 7:00 PM (AST)</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
