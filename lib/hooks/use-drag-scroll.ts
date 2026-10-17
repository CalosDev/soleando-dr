'use client'

import { useRef, useEffect } from 'react'

/**
 * Hook de arrastre horizontal (Drag Scroll) inspirado en la implementación de Midudev.
 * Permite desplazar contenedores horizontales con el ratón en escritorio como si fuera
 * una pantalla táctil. El desplazamiento táctil continúa siendo nativo.
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
    let suppressClick = false
    let restoreTimer: ReturnType<typeof setTimeout> | undefined
    const originalStyles = {
      cursor: el.style.cursor,
      userSelect: el.style.userSelect,
      scrollBehavior: el.style.scrollBehavior,
      scrollSnapType: el.style.scrollSnapType,
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onMouseDown = (e: MouseEvent) => {
      // Solo clic izquierdo
      if (e.button !== 0) return

      isDown = true
      isDragging = false
      suppressClick = false
      clearTimeout(restoreTimer)
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft

      el.style.cursor = 'grabbing'
      el.style.userSelect = 'none'
      el.style.scrollBehavior = 'auto'
      el.style.scrollSnapType = 'none'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 1.4 // Factor de aceleración suave

      if (!isDragging && Math.abs(walk) <= 5) return
      isDragging = true
      e.preventDefault()

      el.scrollLeft = scrollLeft - walk
    }

    const onMouseUpOrLeave = () => {
      if (!isDown) return
      isDown = false
      suppressClick = isDragging
      isDragging = false

      el.style.cursor = 'grab'
      el.style.userSelect = originalStyles.userSelect

      if (!prefersReducedMotion) {
        el.style.scrollBehavior = 'smooth'
      }

      // Restablecer snap después de un breve instante
      restoreTimer = setTimeout(() => {
        el.style.scrollBehavior = originalStyles.scrollBehavior
        el.style.scrollSnapType = originalStyles.scrollSnapType
        suppressClick = false
      }, 250)
    }

    // Evitar que los clics en enlaces o botones se disparen si el usuario estaba arrastrando
    const onClickCapture = (e: MouseEvent) => {
      // Keyboard activation has detail=0 and must remain usable after a drag.
      if (suppressClick && e.detail > 0) {
        e.preventDefault()
        e.stopPropagation()
      }
      suppressClick = false
    }

    el.style.cursor = 'grab'
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUpOrLeave)
    el.addEventListener('mouseleave', onMouseUpOrLeave)
    el.addEventListener('click', onClickCapture, true)

    return () => {
      clearTimeout(restoreTimer)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUpOrLeave)
      el.removeEventListener('mouseleave', onMouseUpOrLeave)
      el.removeEventListener('click', onClickCapture, true)
      Object.assign(el.style, originalStyles)
    }
  }, [])

  return ref
}
