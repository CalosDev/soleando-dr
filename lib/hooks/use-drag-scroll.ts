'use client'

import { useRef, useEffect } from 'react'

/**
 * Hook de arrastre horizontal (Drag Scroll) inspirado en la implementación de Midudev.
 * Permite desplazar contenedores horizontales con el ratón en escritorio como si fuera
 * una pantalla táctil, con inercia, cambio de cursor y compatibilidad total con touch.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let isDown = false
    let startX = 0
    let scrollLeft = 0
    let isDragging = false

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onMouseDown = (e: MouseEvent) => {
      // Solo clic izquierdo
      if (e.button !== 0) return

      isDown = true
      isDragging = false
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft

      el.style.cursor = 'grabbing'
      el.style.userSelect = 'none'
      el.style.scrollBehavior = 'auto'
      el.style.scrollSnapType = 'none'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()

      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 1.4 // Factor de aceleración suave

      if (Math.abs(walk) > 5) {
        isDragging = true
      }

      el.scrollLeft = scrollLeft - walk
    }

    const onMouseUpOrLeave = () => {
      if (!isDown) return
      isDown = false

      el.style.cursor = 'grab'
      el.style.removeProperty('user-select')

      if (!prefersReducedMotion) {
        el.style.scrollBehavior = 'smooth'
      }

      // Restablecer snap después de un breve instante
      setTimeout(() => {
        if (el) {
          el.style.scrollBehavior = ''
          el.style.scrollSnapType = ''
        }
      }, 250)
    }

    // Evitar que los clics en enlaces o botones se disparen si el usuario estaba arrastrando
    const onClickCapture = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    el.style.cursor = 'grab'
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUpOrLeave)
    el.addEventListener('mouseleave', onMouseUpOrLeave)
    el.addEventListener('click', onClickCapture, true)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUpOrLeave)
      el.removeEventListener('mouseleave', onMouseUpOrLeave)
      el.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  return ref
}
