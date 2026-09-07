'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const TRAVEL_HIGHLIGHTS = [
  '🌴 ISLA SAONA VIP',
  '✈️ SEMANA SANTA 2027',
  '🍹 RESORTS ALL INCLUSIVE',
  '🇵🇪 MACHU PICCHU & CUSCO',
  '⛵ SUNSET CRUISE & CHAMPAGNE',
  '🌊 LOPESAN CAOBA LAGOON',
  '🌿 CASCADAS DE SAMANÁ',
  '🚢 CRUCERO POR BRASIL',
  '☀️ EXPERIENCIAS CON ALMA CARIBEÑA',
]

export function TravelKineticRibbon() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current) return

    let currentScroll = window.scrollY
    let xPos = 0
    let baseSpeed = 1.2

    const marquee = () => {
      xPos -= baseSpeed
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${xPos}px)`
        // Loop back seamlessly
        if (Math.abs(xPos) >= trackRef.current.scrollWidth / 2) {
          xPos = 0
        }
      }
      requestAnimationFrame(marquee)
    }

    const animId = requestAnimationFrame(marquee)

    // Scroll speed reaction
    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - currentScroll)
      currentScroll = window.scrollY
      // Temporarily speed up when user scrolls vigorously
      baseSpeed = Math.min(1.2 + delta * 0.15, 8)

      // Smooth decay back to normal speed
      gsap.to(
        { speed: baseSpeed },
        {
          speed: 1.2,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: function () {
            baseSpeed = this.targets()[0].speed
          },
        }
      )
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        background: 'linear-gradient(90deg, #fadc40 0%, #f8a815 25%, #f87a12 50%, #f64d0b 75%, #ff2e00 100%)',
        padding: '16px 0',
        transform: 'rotate(-1.2deg) scale(1.03)',
        margin: '50px 0',
        boxShadow: '0 8px 30px rgba(246, 77, 11, 0.28)',
        userSelect: 'none',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          gap: '40px',
          willChange: 'transform',
        }}
      >
        {/* Double array for seamless infinite looping */}
        {[...TRAVEL_HIGHLIGHTS, ...TRAVEL_HIGHLIGHTS].map((item, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '15px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              color: '#ffffff',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              textShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}
          >
            {item}
            <span style={{ opacity: 0.6, fontSize: '10px' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
