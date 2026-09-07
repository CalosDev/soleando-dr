'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function Arrow() {
  return (
    <svg aria-hidden="true" className="inline-block ml-1.5 w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
      <path d="M1 9L9 1H2M9 1V8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
    </svg>
  )
}

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

const SOLEANDO_ANCHA = [linea('Soleando', 500, 150, 185)]
const SOLEANDO_ALTA_TAMANO = 160
const SOLEANDO_ALTA_PASO = Math.round(SOLEANDO_ALTA_TAMANO * 0.9)
const SOLEANDO_ALTA = [
  linea('Sole', 500, 150 - Math.round(SOLEANDO_ALTA_PASO / 2), SOLEANDO_ALTA_TAMANO),
  linea('ando', 500, 150 + Math.round(SOLEANDO_ALTA_PASO / 2), SOLEANDO_ALTA_TAMANO),
]

interface PhraseSegment {
  text: string
  className?: string
}

type PhraseLine = PhraseSegment[]

const PHRASE_1: PhraseLine[] = [
  [{ text: 'El Caribe', className: 'text-[#fffffe] drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]' }],
  [{ text: 'te llama', className: 'text-[#FFE600] drop-shadow-[0_0_32px_rgba(255,230,0,0.55)]' }],
  [{ text: 'por tu nombre.', className: 'text-[#fffffe] drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]' }],
]

const PHRASE_2: PhraseLine[] = [
  [{ text: 'Sal de la rutina.', className: 'text-[#fffffe]/95 drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]' }],
  [
    { text: 'Entra al ', className: 'text-[#fffffe] drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]' },
    { text: 'paraíso.', className: 'text-[#FF6B00] drop-shadow-[0_0_35px_rgba(255,107,0,0.6)]' },
  ],
]

export function HeroCinematicScroll() {
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
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReducedMotion) return

    const section = sectionRef.current
    if (!section || !coverRef.current || !dateHoleRef.current || !dateFillRef.current || !mediaRef.current) return

    const ctx = gsap.context(() => {
      const BLUR = 24
      const letterDur = 2.2
      const letterStagger = 0.075
      const hold = 5

      const SOLEANDO_ZOOM = 6.5
      const SOLEANDO_ORIGIN = '500 150'
      const MEDIA_ZOOM = 1.45
      const COVER_IN = 2.5
      const DATE_IN = 38
      const DATE_SWAP = 4.5
      const DATE_HOLD = 12
      const DATE_OUT = 8
      const DATE_OFFSET = 0.5

      const DATE_SETTLED = DATE_OFFSET + DATE_IN 
      const DATE_EXIT = DATE_SETTLED + DATE_HOLD  
      const PHRASE_START = DATE_EXIT + DATE_OUT    

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=540%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // 1. Entrada del velo
      tl.fromTo(coverRef.current, { opacity: 0 }, { opacity: 1, duration: COVER_IN }, 0)

      // 2. Zoom In de SOLEANDO
      tl.fromTo(
        [dateHoleRef.current, dateFillRef.current],
        { scale: SOLEANDO_ZOOM, svgOrigin: SOLEANDO_ORIGIN },
        { scale: 1, svgOrigin: SOLEANDO_ORIGIN, duration: DATE_IN, ease: 'power1.out' },
        DATE_OFFSET
      )

      // 3. Ken Burns de la imagen de fondo inicial (Catamarán)
      tl.fromTo(mediaRef.current, { scale: MEDIA_ZOOM }, { scale: 1, duration: DATE_IN, ease: 'power1.out' }, 0)

      // Ocultar la pista de scroll
      if (scrollCueRef.current) tl.to(scrollCueRef.current, { opacity: 0, y: -20, duration: 3.5 }, 0)

      // 4. El Relevo: la máscara se desenfoca y cierra, y el texto blanco sólido toma el relevo
      tl.to(dateBlurRef.current, { attr: { stdDeviation: BLUR / 3 }, duration: DATE_SWAP }, DATE_SETTLED - DATE_SWAP)
      tl.to(dateHoleRef.current, { fillOpacity: 0, duration: DATE_SWAP }, DATE_SETTLED - DATE_SWAP)
      tl.fromTo(dateFillRef.current, { opacity: 0 }, { opacity: 1, duration: DATE_SWAP }, DATE_SETTLED - DATE_SWAP)

      // A partir de que aparece SOLEANDO en letras blancas, revelamos la imagen paradisíaca de fondo
      if (paradiseMediaRef.current && coverRectRef.current) {
        tl.fromTo(
          paradiseMediaRef.current,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1.04, duration: DATE_SWAP, ease: 'power1.out' },
          DATE_SETTLED - DATE_SWAP
        )
        tl.to(
          coverRectRef.current,
          { opacity: 0, duration: DATE_SWAP },
          DATE_SETTLED - DATE_SWAP
        )
        // Zoom sutil continuo en la imagen de fondo paradisíaca
        tl.to(
          paradiseMediaRef.current,
          { scale: 1.0, duration: PHRASE_START + 25 - (DATE_SETTLED - DATE_SWAP), ease: 'none' },
          DATE_SETTLED
        )
      }

      // 5. Salida de SOLEANDO (Se encoge y desenfoca)
      tl.fromTo(
        dateFillRef.current,
        { scale: 1, filter: 'blur(0px)', svgOrigin: SOLEANDO_ORIGIN },
        { scale: 0.4, filter: `blur(${BLUR}px)`, opacity: 0, svgOrigin: SOLEANDO_ORIGIN, duration: DATE_OUT },
        DATE_EXIT
      )

      // 6. Animación de las frases
      let phraseAt = PHRASE_START

      const animatePhrase = (phraseEl: HTMLDivElement | null) => {
        if (!phraseEl) return
        const chars = phraseEl.querySelectorAll('[data-char]')
        const revealSpan = letterDur + Math.max(0, chars.length - 1) * letterStagger

        gsap.set(chars, { opacity: 0, filter: `blur(${BLUR}px)` })

        tl.fromTo(chars, { opacity: 0, filter: `blur(${BLUR}px)` }, { opacity: 1, filter: 'blur(0px)', duration: letterDur, stagger: letterStagger }, phraseAt)
        phraseAt += revealSpan + hold
        tl.to(chars, { opacity: 0, filter: `blur(${BLUR}px)`, duration: letterDur, stagger: { each: letterStagger, from: 'start' } }, phraseAt)
        phraseAt += revealSpan + 1.5
      }

      animatePhrase(phrase1Ref.current)

      if (phrase2Ref.current) {
        const chars2 = phrase2Ref.current.querySelectorAll('[data-char]')
        const revealSpan2 = letterDur + Math.max(0, chars2.length - 1) * letterStagger

        gsap.set(chars2, { opacity: 0, filter: `blur(${BLUR}px)` })
        tl.fromTo(chars2, { opacity: 0, filter: `blur(${BLUR}px)` }, { opacity: 1, filter: 'blur(0px)', duration: letterDur, stagger: letterStagger }, phraseAt)

        if (ctaRef.current) {
          tl.fromTo(
            ctaRef.current,
            { opacity: 0, y: 24, filter: 'blur(8px)', pointerEvents: 'none' },
            { opacity: 1, y: 0, filter: 'blur(0px)', pointerEvents: 'auto', duration: 3.5, ease: 'power2.out' },
            phraseAt + revealSpan2 * 0.75
          )
        }

        tl.to(mediaRef.current, { yPercent: 8, duration: 9, ease: 'none' }, phraseAt)
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="inicio" className="hero-cinematic-section relative h-screen bg-[#1c1917] overflow-hidden">
      <h1 className="sr-only">Soleando — Excursiones y tours únicos</h1>

      <div className="absolute inset-0 h-full w-full flex items-center justify-center">
        
        {/* Fondo 1: Catamarán (se ve inicialmente y a través de las letras) */}
        <div ref={mediaRef} className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0">
          <Image src="/soleando-hero.png" alt="Catamarán" fill priority sizes="100vw" className="object-cover object-center" />
        </div>

        {/* Fondo 2: Playa paradisíaca tropical (se activa a partir de las letras blancas de SOLEANDO) */}
        <div ref={paradiseMediaRef} className="absolute inset-0 w-full h-full pointer-events-none will-change-transform opacity-0 z-[1]">
          <Image src="/soleando-paradise.jpg" alt="Playa paradisíaca caribeña" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/85 via-black/20 to-[#1c1917]/35 pointer-events-none" />
        </div>

        {/* Capa de máscara SVG */}
        <svg
          ref={coverRef}
          className="absolute inset-0 h-full w-full pointer-events-none select-none opacity-0 z-[2]"
          viewBox="0 0 1000 300"
          preserveAspectRatio="xMidYMid meet"
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
              <g ref={dateHoleRef} fill="#000000" fillOpacity="1" filter="url(#hero-soleando-soft)" style={{ fontFamily: 'var(--font-billion), "Billion Dreams", "Brush Script MT", cursive, sans-serif' }}>
                <g className="soleando-layout--ancha">
                  {SOLEANDO_ANCHA.map((l, i) => <text key={i} {...l.attrs}>{l.texto}</text>)}
                </g>
                <g className="soleando-layout--alta">
                  {SOLEANDO_ALTA.map((l, i) => <text key={i} {...l.attrs}>{l.texto}</text>)}
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
              filter: 'drop-shadow(0px 8px 30px rgba(0, 0, 0, 0.7))',
            }}
          >
            <g className="soleando-layout--ancha">
              {SOLEANDO_ANCHA.map((l, i) => <text key={i} {...l.attrs}>{l.texto}</text>)}
            </g>
            <g className="soleando-layout--alta">
              {SOLEANDO_ALTA.map((l, i) => <text key={i} {...l.attrs}>{l.texto}</text>)}
            </g>
          </g>
        </svg>

        {/* Frase 1 */}
        <div ref={phrase1Ref} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none z-10">
          <p className="text-[clamp(2.4rem,7.8vw,5.6rem)] font-normal uppercase leading-[0.96] tracking-wide" style={{ fontFamily: 'var(--font-anton), Anton, Impact, sans-serif' }}>
            {PHRASE_1.map((line, lIdx) => (
              <span key={lIdx} className="block whitespace-nowrap">
                {line.map((seg, sIdx) => (
                  <span key={sIdx} className={seg.className}>
                    {Array.from(seg.text).map((char, cIdx) => (
                      <span key={cIdx} data-char className="inline-block will-change-transform will-change-[filter,opacity]">{char === ' ' ? '\u00A0' : char}</span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>

        {/* Frase 2 y CTA */}
        <div ref={phrase2Ref} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none z-10">
          <p className="text-[clamp(2.4rem,7.8vw,5.6rem)] font-normal uppercase leading-[0.96] tracking-wide" style={{ fontFamily: 'var(--font-anton), Anton, Impact, sans-serif' }}>
            {PHRASE_2.map((line, lIdx) => (
              <span key={lIdx} className="block whitespace-nowrap">
                {line.map((seg, sIdx) => (
                  <span key={sIdx} className={seg.className}>
                    {Array.from(seg.text).map((char, cIdx) => (
                      <span key={cIdx} data-char className="inline-block will-change-transform will-change-[filter,opacity]">{char === ' ' ? '\u00A0' : char}</span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </p>
          <div ref={ctaRef} className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 pointer-events-auto opacity-0">
            <a
              className="bg-gradient-to-r from-[#fadc40] via-[#f8a815] to-[#f87a12] text-[#1c1917] hover:brightness-110 font-bold px-8 py-3.5 text-sm sm:text-base rounded-full shadow-2xl shadow-[#f8a815]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center"
              href="https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Quiero vivirlo <Arrow />
            </a>
            <a
              className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full border border-white/50 hover:border-[#fadc40] text-[#fffffe] hover:text-[#fadc40] text-sm sm:text-base font-semibold backdrop-blur-md bg-black/30 hover:bg-black/50 transition-all cursor-pointer shadow-lg"
              href="#ofertas"
            >
              Explora nuestras ofertas
            </a>
          </div>
        </div>

        <div ref={scrollCueRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20">
          <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#fffffe]/80 drop-shadow-sm">Desliza</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5 backdrop-blur-sm bg-black/20">
            <div className="w-1.5 h-2.5 bg-[#fadc40] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
      <style>{`
        .soleando-layout--alta { display: none; }
        @media (max-width: 639px) and (max-aspect-ratio: 4/5) {
          .soleando-layout--ancha { display: none; }
          .soleando-layout--alta { display: inline; }
        }
      `}</style>
    </section>
  )
}