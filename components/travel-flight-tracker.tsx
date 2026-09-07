'use client'

import { useEffect, useState } from 'react'

export function TravelFlightTracker() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeDestination, setActiveDestination] = useState('Santo Domingo')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      const current = window.scrollY
      const progress = Math.min(Math.max(current / totalHeight, 0), 1)
      setScrollProgress(progress)

      // Determine active destination based on scroll percentage
      if (progress < 0.25) {
        setActiveDestination('Santo Domingo 🇩🇴')
      } else if (progress < 0.5) {
        setActiveDestination('Punta Cana & Bávaro 🌴')
      } else if (progress < 0.75) {
        setActiveDestination('Samaná & Saona 🏝️')
      } else {
        setActiveDestination('Machu Picchu 🇵🇪')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <aside
      aria-label="Progreso de viaje"
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '32px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Destination Tag Pill */}
      <div
        style={{
          background: 'rgba(255, 255, 254, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(246, 77, 11, 0.25)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          borderRadius: '50px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#1c1917',
          transform: isHovered || scrollProgress > 0.05 ? 'translateX(0)' : 'translateX(10px)',
          opacity: isHovered || scrollProgress > 0.05 ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ff2e00',
            animation: 'pulseDot 1.5s infinite',
          }}
        />
        <span>Rumbo a: <strong>{activeDestination}</strong></span>
        <span style={{ color: '#f64d0b', fontSize: '11px', fontWeight: 800 }}>
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>

      {/* Plane Circle / Sun Compass Widget */}
      <button
        onClick={() => window.scrollTo({ top: scrollProgress > 0.9 ? 0 : window.scrollY + 500, behavior: 'smooth' })}
        aria-label="Ir a la siguiente parada o volver arriba"
        style={{
          position: 'relative',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fadc40 0%, #f8a815 25%, #f87a12 50%, #f64d0b 75%, #ff2e00 100%)',
          border: 'none',
          boxShadow: '0 6px 24px rgba(246, 77, 11, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'scale(1.12) rotate(10deg)' : 'scale(1)',
        }}
      >
        {/* SVG Circular Progress Ring */}
        <svg
          width="54"
          height="54"
          viewBox="0 0 54 54"
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="27"
            cy="27"
            r="24"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
          />
          <circle
            cx="27"
            cy="27"
            r="24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - scrollProgress)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>

        {/* Airplane Icon rotated along flight angle */}
        <span
          style={{
            fontSize: '22px',
            color: '#fff',
            display: 'inline-block',
            transform: `rotate(${scrollProgress > 0.9 ? -45 : 45}deg)`,
            transition: 'transform 0.3s ease',
          }}
        >
          ✈️
        </span>
      </button>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @media (max-width: 640px) {
          aside[aria-label="Progreso de viaje"] {
            right: 16px;
            bottom: 20px;
          }
        }
      `}</style>
    </aside>
  )
}
