'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function GsapScrollAnimations() {
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // 1. Header Entrance Animation
      gsap.from('.site-header', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      // 2. Offers Carousel Section Entrance
      gsap.from('#ofertas .section-heading', {
        scrollTrigger: {
          trigger: '#ofertas',
          start: 'top 80%',
          once: true,
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
      })

      ScrollTrigger.batch('.carousel-card', {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.15,
              duration: 0.85,
              ease: 'power2.out',
              overwrite: true,
            }
          )
        },
      })

      // 4. Nosotros Section
      gsap.from('#nosotros .intro-grid h2', {
        scrollTrigger: {
          trigger: '#nosotros',
          start: 'top 80%',
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
      })

      gsap.from('#nosotros .intro-grid p', {
        scrollTrigger: {
          trigger: '#nosotros',
          start: 'top 75%',
          once: true,
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power2.out',
      })

      // 5. Manifesto Section
      gsap.from('.manifesto-inner', {
        scrollTrigger: {
          trigger: '.manifesto',
          start: 'top 80%',
          once: true,
        },
        scale: 0.94,
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })

      // 6. Contact Section
      gsap.from('#contacto .contact-grid > div:first-child', {
        scrollTrigger: {
          trigger: '#contacto',
          start: 'top 80%',
          once: true,
        },
        x: -30,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
      })

      ScrollTrigger.batch('.contact-item', {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, x: 30 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.12,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: true,
            }
          )
        },
      })
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return null
}
