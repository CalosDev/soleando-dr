'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import Link from 'next/link'
import {
  Sparkles,
  RotateCcw,
  FastForward,
  ArrowUpRight,
} from 'lucide-react'
import { HotelSearchForm } from './hotel-search-form'

const linea = (texto: string, x: number, y: number, tamano: number) => ({
  texto,
  attrs: {
    x,
    y,
    textAnchor: 'middle' as const,
    dominantBaseline: 'central' as const,
    fontSize: tamano,
    letterSpacing: 0,
  },
})

const SOLEANDO_DESKTOP = [linea('Soleando', 500, 500, 150)]
const SOLEANDO_MOBILE = [linea('Soleando', 500, 500, 92)]

interface PhraseSegment {
  text: string
  className?: string
}

type PhraseLine = PhraseSegment[]

const PHRASE_1: PhraseLine[] = [
  [{ text: 'El Caribe', className: 'text-[#fffffe] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]' }],
  [{ text: 'te llama', className: 'text-[#FFE600] drop-shadow-[0_0_35px_rgba(255,230,0,0.65)]' }],
  [{ text: 'por tu nombre.', className: 'text-[#fffffe] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]' }],
]

const PHRASE_2: PhraseLine[] = [
  [{ text: 'Sal de la rutina.', className: 'text-[#fffffe]/95 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]' }],
  [
    { text: 'Entra al ', className: 'text-[#fffffe] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]' },
    { text: 'paraíso.', className: 'text-[#FF6B00] drop-shadow-[0_0_40px_rgba(255,107,0,0.7)]' },
  ],
]

export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null)
  const coverRef = useRef<SVGSVGElement>(null)
  const coverRectRef = useRef<SVGRectElement>(null)
  const dateHoleRef = useRef<SVGGElement>(null)
  const dateBlurRef = useRef<SVGFEGaussianBlurElement>(null)
  const dateFillRef = useRef<SVGGElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const paradiseMediaRef = useRef<HTMLDivElement>(null)
  const phrase1Ref = useRef<HTMLDivElement>(null)
  const phrase2Ref = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const climaxContentRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  const [isFinished, setIsFinished] = useState(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const section = sectionRef.current
    if (!section || !coverRef.current || !dateHoleRef.current || !dateFillRef.current || !mediaRef.current) return

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        // En modo movimiento reducido, mostrar directo el estado final
        gsap.set(paradiseMediaRef.current, { opacity: 1, scale: 1 })
        gsap.set(coverRef.current, { opacity: 0, display: 'none' })
        gsap.set(phrase1Ref.current, { opacity: 0, display: 'none' })
        gsap.set(phrase2Ref.current, { opacity: 1, display: 'block' })
        if (phrase2Ref.current) {
          const chars2 = phrase2Ref.current.querySelectorAll('[data-char]')
          gsap.set(chars2, { opacity: 1, filter: 'blur(0px)', y: 0 })
        }
        gsap.set(badgeRef.current, { opacity: 1, y: 0 })
        gsap.set(subtitleRef.current, { opacity: 1, y: 0 })
        gsap.set(climaxContentRef.current, { opacity: 1, y: 0, pointerEvents: 'auto' })
        setIsFinished(true)
        return
      }

      const BLUR = 20
      const SOLEANDO_ORIGIN = '500 500'

      // Master Timeline Automática
      const tl = gsap.timeline({
        paused: false,
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          setIsFinished(true)
        },
      })
      tlRef.current = tl

      // 0. Set inicial
      gsap.set(coverRef.current, { opacity: 1, display: 'block' })
      gsap.set([dateHoleRef.current, dateFillRef.current], { scale: 4.8, svgOrigin: SOLEANDO_ORIGIN })
      gsap.set(dateFillRef.current, { opacity: 0 })
      gsap.set(mediaRef.current, { scale: 1.18, opacity: 1 })
      gsap.set(paradiseMediaRef.current, { opacity: 0, scale: 1.08 })
      gsap.set(badgeRef.current, { opacity: 0, y: -14 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 14 })
      gsap.set(climaxContentRef.current, { opacity: 0, y: 24, pointerEvents: 'none' })
      gsap.set(controlsRef.current, { opacity: 0 })

      // Frases caracteres iniciales
      if (phrase1Ref.current) {
        const chars1 = phrase1Ref.current.querySelectorAll('[data-char]')
        gsap.set(chars1, { opacity: 0, filter: `blur(${BLUR}px)`, y: 16 })
      }
      if (phrase2Ref.current) {
        const chars2 = phrase2Ref.current.querySelectorAll('[data-char]')
        gsap.set(chars2, { opacity: 0, filter: `blur(${BLUR}px)`, y: 16 })
      }

      // ==========================================
      // ACTO 1: Portal Soleando & Ken Burns inicial
      // ==========================================
      // Despliegue del botón skip/controls
      tl.to(controlsRef.current, { opacity: 1, duration: 0.6 }, 0.2)

      // Zoom hacia adentro del logotipo Soleando (efecto portal mirando la playa a través de las letras)
      tl.to(
        [dateHoleRef.current, dateFillRef.current],
        { scale: 1, svgOrigin: SOLEANDO_ORIGIN, duration: 2.2, ease: 'power3.out' },
        0.1
      )

      // Ken Burns sutil en el fondo de palmeras
      tl.to(mediaRef.current, { scale: 1.02, duration: 2.8, ease: 'power1.out' }, 0)

      // Iluminación dorada del logo Soleando con gradiente cálido
      tl.to(dateFillRef.current, { opacity: 1, duration: 0.8, ease: 'power2.inOut' }, 1.4)
      tl.to(dateBlurRef.current, { attr: { stdDeviation: BLUR / 4 }, duration: 0.8 }, 1.4)

      // Transición al fondo de Paraíso y disolución de la máscara
      if (paradiseMediaRef.current && coverRectRef.current) {
        tl.to(
          paradiseMediaRef.current,
          { opacity: 1, scale: 1.04, duration: 1.2, ease: 'power2.out' },
          1.8
        )
        tl.to(coverRectRef.current, { opacity: 0, duration: 1.0, ease: 'power2.out' }, 1.8)
      }

      // ==========================================
      // ACTO 2: Disolución elegante del logo
      // ==========================================
      tl.to(
        dateFillRef.current,
        {
          scale: 0.88,
          filter: `blur(${BLUR}px)`,
          opacity: 0,
          svgOrigin: SOLEANDO_ORIGIN,
          duration: 0.9,
          ease: 'power2.in',
        },
        2.5
      )

      // ==========================================
      // ACTO 3: Primera Frase — "El Caribe te llama..."
      // ==========================================
      if (phrase1Ref.current) {
        const chars1 = phrase1Ref.current.querySelectorAll('[data-char]')
        tl.set(phrase1Ref.current, { opacity: 1, display: 'flex' }, 3.1)
        tl.to(
          chars1,
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.7,
            stagger: 0.035,
            ease: 'power2.out',
          },
          3.2
        )

        // Pausa contemplativa para lectura y desvanecimiento suave hacia arriba
        tl.to(
          chars1,
          {
            opacity: 0,
            filter: `blur(${BLUR}px)`,
            y: -14,
            duration: 0.65,
            stagger: 0.02,
            ease: 'power2.in',
          },
          5.6
        )
        tl.set(phrase1Ref.current, { opacity: 0, display: 'none' }, 6.3)
      }

      // ==========================================
      // ACTO 4: Clímax — "Sal de la rutina. Entra al paraíso." + Buscador de Hoteles & Asesor
      // ==========================================
      if (phrase2Ref.current) {
        const chars2 = phrase2Ref.current.querySelectorAll('[data-char]')
        tl.set(phrase2Ref.current, { opacity: 1, display: 'flex' }, 6.35)
        tl.to(
          chars2,
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power2.out',
          },
          6.4
        )
      }

      // Badge flotante: Nuevas salidas 2027 disponibles
      if (badgeRef.current) {
        tl.to(
          badgeRef.current,
          { opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.4)' },
          6.95
        )
      }

      // Subtítulo descriptivo: Aparece suavemente bajo el título principal
      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
          },
          7.1
        )
      }

      // Revelación suave del buscador de hoteles
      tl.to(
        climaxContentRef.current,
        {
          opacity: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: 0.8,
          ease: 'power3.out',
        },
        7.35
      )


      // Ken Burns continuo y suave en el fondo paraíso
      tl.to(
        paradiseMediaRef.current,
        { scale: 1.0, duration: 12, ease: 'sine.out' },
        3.0
      )
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  const handleSkip = () => {
    if (tlRef.current) {
      tlRef.current.progress(1)
      setIsFinished(true)
    }
  }

  const handleReplay = () => {
    if (tlRef.current) {
      setIsFinished(false)
      tlRef.current.restart()
    }
  }

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="hero-cinematic-section relative min-h-[100dvh] w-full bg-[#1c1917] overflow-hidden flex flex-col items-center justify-center pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-8"
    >
      <h1 className="sr-only">Soleando — Hoteles, viajes y experiencias únicas en República Dominicana</h1>

      <div className="absolute inset-0 h-full w-full flex items-center justify-center pointer-events-none">
        {/* Fondo 1: Palmeras y playa tropical (se ve al inicio a través del zoom portal) */}
        <div ref={mediaRef} className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0">
          <Image
            src="/soleando-hero.webp"
            alt="Playa tropical con palmeras en República Dominicana"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/95 via-[#1c1917]/20 to-transparent pointer-events-none" />
        </div>

        {/* Fondo 2: Paraíso tropical idílico */}
        <div
          ref={paradiseMediaRef}
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-[1] opacity-0"
        >
          <Image
            src="/soleando-paradise.jpg"
            alt="Paraíso caribeño de República Dominicana"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Overlays para garantizar excelente contraste y legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/95 via-black/45 to-[#1c1917]/50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(28,25,23,0.7)_100%)] pointer-events-none" />
        </div>

        {/* Capa de máscara SVG con tipografía Soleando */}
        <svg
          ref={coverRef}
          className="absolute inset-0 h-full w-full pointer-events-none select-none z-[2]"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hero-soleando-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE600" />
              <stop offset="50%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#E52300" />
            </linearGradient>
            <filter id="hero-soleando-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur ref={dateBlurRef} stdDeviation="0" />
            </filter>
            <mask id="hero-soleando-hole" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="12000" height="12000">
              <rect x="-5000" y="-5000" width="12000" height="12000" fill="#ffffff" />
              <g
                ref={dateHoleRef}
                fill="#000000"
                fillOpacity="1"
                filter="url(#hero-soleando-soft)"
                style={{ fontFamily: 'var(--font-billion), "Billion Dreams", "Brush Script MT", cursive, sans-serif' }}
              >
                <g className="soleando-layout--desktop">
                  {SOLEANDO_DESKTOP.map((l, i) => (
                    <text key={i} {...l.attrs}>{l.texto}</text>
                  ))}
                </g>
                <g className="soleando-layout--mobile">
                  {SOLEANDO_MOBILE.map((l, i) => (
                    <text key={i} {...l.attrs}>{l.texto}</text>
                  ))}
                </g>
              </g>
            </mask>
          </defs>

          <rect ref={coverRectRef} x="-5000" y="-5000" width="12000" height="12000" fill="#1c1917" mask="url(#hero-soleando-hole)" />

          <g
            ref={dateFillRef}
            fill="url(#hero-soleando-gradient)"
            opacity="0"
            style={{
              fontFamily: 'var(--font-billion), "Billion Dreams", "Brush Script MT", cursive, sans-serif',
              filter: 'drop-shadow(0px 8px 32px rgba(255, 107, 0, 0.45))',
            }}
          >
            <g className="soleando-layout--desktop">
              {SOLEANDO_DESKTOP.map((l, i) => (
                <text key={i} {...l.attrs}>{l.texto}</text>
              ))}
            </g>
            <g className="soleando-layout--mobile">
              {SOLEANDO_MOBILE.map((l, i) => (
                <text key={i} {...l.attrs}>{l.texto}</text>
              ))}
            </g>
          </g>
        </svg>

        {/* Frase 1: "El Caribe te llama por tu nombre." */}
        <div
          ref={phrase1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pt-12 sm:pt-0 text-center pointer-events-none z-10 opacity-0"
        >
          <p
            className="text-[clamp(2.2rem,7.8vw,5.5rem)] font-normal uppercase leading-[0.96] sm:leading-[0.92] tracking-wide max-w-[95vw] sm:max-w-none"
            style={{ fontFamily: 'var(--font-anton), Anton, Impact, sans-serif' }}
          >
            {PHRASE_1.map((line, lIdx) => (
              <span key={lIdx} className="block">
                {line.map((seg, sIdx) => (
                  <span key={sIdx} className={seg.className}>
                    {Array.from(seg.text).map((char, cIdx) => (
                      <span key={cIdx} data-char className="inline-block will-change-transform will-change-[filter,opacity] opacity-0">
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Acto 4: Contenedor Principal del Clímax — Frase 2, Buscador, Sellos y Asesoría */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center my-auto">
        {/* Frase 2 y Subtítulo */}
        <div ref={phrase2Ref} className="flex flex-col items-center justify-center text-center opacity-0 mb-5 sm:mb-7">
          {/* Badge / Cápsula flotante: Salidas 2027 */}
          <div ref={badgeRef} className="mb-3.5 sm:mb-4 opacity-0 pointer-events-auto">
            <Link
              href="/ofertas"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase text-[#fadc40] bg-black/60 hover:bg-black/80 border border-[#fadc40]/35 hover:border-[#fadc40]/70 backdrop-blur-md shadow-lg shadow-black/40 transition-all transform hover:scale-105 group cursor-pointer"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#fadc40] animate-pulse" />
              <span>Nuevas salidas 2027 disponibles</span>
              <span className="inline-flex items-center gap-0.5 text-white group-hover:text-[#fadc40] transition-colors">
                Ver ofertas
                <ArrowUpRight className="w-3.5 h-3.5 text-[#fadc40]" />
              </span>
            </Link>
          </div>

          <h2
            className="text-[clamp(1.75rem,5.5vw,3.8rem)] font-normal uppercase leading-[0.96] sm:leading-[0.92] tracking-wide max-w-[95vw] sm:max-w-none"
            style={{ fontFamily: 'var(--font-anton), Anton, Impact, sans-serif' }}
          >
            {PHRASE_2.map((line, lIdx) => (
              <span key={lIdx} className="block">
                {line.map((seg, sIdx) => (
                  <span key={sIdx} className={seg.className}>
                    {Array.from(seg.text).map((char, cIdx) => (
                      <span key={cIdx} data-char className="inline-block will-change-transform will-change-[filter,opacity] opacity-0">
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <p
            ref={subtitleRef}
            className="mt-3.5 text-xs sm:text-sm md:text-base text-stone-200/90 font-sans max-w-none w-full mx-auto font-normal leading-relaxed drop-shadow-md opacity-0 will-change-[transform,opacity] text-center sm:whitespace-nowrap"
          >
            Encuentra hoteles, resorts todo incluido y experiencias seleccionadas para vivir a tu manera.
          </p>
        </div>

        {/* Bloque interactivo: Buscador de Hoteles */}
        <div ref={climaxContentRef} className="w-full opacity-0 pointer-events-none relative z-30">
          <div className="w-full">
            <HotelSearchForm />
          </div>
        </div>
      </div>

      {/* Controles discretos (Saltar / Repetir) */}
      <div ref={controlsRef} className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 opacity-0">
        {!isFinished ? (
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-white/80 hover:text-white bg-black/40 hover:bg-black/70 border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Saltar animación intro"
            title="Saltar intro"
          >
            <FastForward className="w-3.5 h-3.5 text-[#fadc40]" />
            <span>Saltar</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-white/80 hover:text-[#fadc40] bg-black/40 hover:bg-black/70 border border-white/20 hover:border-[#fadc40]/50 backdrop-blur-md transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Repetir animación del hero"
            title="Repetir animación"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#fadc40]" />
            <span>Repetir</span>
          </button>
        )}
        
      </div>

      <style>{`
        .soleando-layout--mobile { display: none; }
        @media (max-width: 639px) {
          .soleando-layout--desktop { display: none; }
          .soleando-layout--mobile { display: inline; }
        }
      `}</style>
    </section>
  )
}
