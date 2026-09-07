'use client'

import Image from 'next/image'
import { Sparkles } from 'lucide-react'

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      className="arrow inline-block ml-1.5"
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
    >
      <path
        d="M1 9L9 1M9 1H2M9 1V8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  )
}

export function Hero() {
  return (
    <section id="inicio" className="hero">
      {/* Imagen de fondo nítida y natural */}
      <Image
        src="/soleando-hero.png"
        alt="Soleando - Catamarán navegando hacia una playa en República Dominicana"
        fill
        priority
        sizes="100vw"
        className="hero-image"
      />

      {/* Overlay sutil para legibilidad sin tintes verdes */}
      <div className="hero-overlay" />

      {/* Contenido principal del Hero */}
      <div className="hero-content">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-[0.16em] uppercase text-[#fadc40] bg-black/40 border border-[#fadc40]/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#fadc40]" />
            República Dominicana • Experiencias Únicas
          </span>
        </div>

        <h1>
          Sal de la rutina,<br />
          <em>Entra al paraíso.</em>
        </h1>

        <p className="hero-copy">
          Tours pensados para vivir la República Dominicana de una forma auténtica, bonita y sin complicaciones.
        </p>

        <div className="hero-actions">
          <a
            className="button button-sun shadow-lg hover:shadow-[#f8a815]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            href="https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Quiero vivirlo <Arrow />
          </a>
          <a className="text-link" href="#ofertas">
            Explora nuestras ofertas <Arrow />
          </a>
        </div>
      </div>

      <div className="hero-note hidden sm:flex">
        <span className="note-line" />
        <span>Excursiones privadas & grupales</span>
      </div>
    </section>
  )
}
