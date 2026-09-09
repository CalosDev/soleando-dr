'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface RevealContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number // ms between items
  threshold?: number
}

/**
 * Componente de revelación al scroll inspirado en revealOnScroll (GSAP / Midudev).
 * Detecta la entrada en viewport y aplica un stagger fluido a los elementos hijos directos.
 * Respeta 100% prefers-reduced-motion para accesibilidad y no genera layout shift.
 */
export function RevealContainer({
  children,
  className = '',
  staggerDelay = 90,
  threshold = 0.15,
}: RevealContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setReducedMotion(true)
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    const el = containerRef.current
    if (el) {
      observer.observe(el)
    }

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [threshold])

  return (
    <div
      ref={containerRef}
      className={className}
      style={
        !reducedMotion
          ? ({
              '--reveal-stagger': `${staggerDelay}ms`,
            } as React.CSSProperties)
          : undefined
      }
      data-reveal-active={isVisible ? 'true' : 'false'}
    >
      {children}
    </div>
  )
}
