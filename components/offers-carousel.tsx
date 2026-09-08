'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Calendar, Check, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { ArrowUpRightIcon } from '@/components/icons'

export interface CarouselOffer {
  id: string
  slug?: string
  title: string
  destination: string
  category: string
  description: string
  price?: string | null
  oldPrice?: string | null
  currency?: string
  badge?: string
  dateLabel?: string | null
  includes?: string[]
  imageUrl: string
  whatsappText?: string
}

interface OffersCarouselProps {
  offers: CarouselOffer[]
}

function formatPriceValue(val?: string | null): string {
  if (!val) return ''
  const clean = val.replace(/[^0-9.]/g, '')
  const num = parseFloat(clean)
  if (isNaN(num)) return val
  return num.toLocaleString('en-US', {
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
  })
}

export function OffersCarousel({ offers }: OffersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)

    // Calculate approximate active card
    const card = el.firstElementChild as HTMLElement | null
    if (card) {
      const cardWidth = card.offsetWidth + 22 // card width + gap
      const index = Math.round(el.scrollLeft / cardWidth)
      setActiveIndex(Math.min(Math.max(0, index), offers.length - 1))
    }
  }, [offers.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return

    const card = el.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 22 : 380

    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    })
  }

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current
    if (!el) return

    const card = el.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 22 : 380

    el.scrollTo({
      left: step * index,
      behavior: 'smooth',
    })
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="text-center py-12 px-6 rounded-2xl bg-white/40 border border-black/5 max-w-lg mx-auto my-6 backdrop-blur-sm">
        <p className="text-stone-700 text-sm font-medium">Estamos preparando nuevas experiencias exclusivas.</p>
        <p className="text-stone-500 text-xs mt-1">Escríbenos por WhatsApp para cotizar tu viaje personalizado.</p>
        <a
          href="https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#f64d0b] font-semibold mt-4 hover:underline"
        >
          Consultar por WhatsApp <ArrowUpRightIcon className="w-3.5 h-3.5 inline-block" />
        </a>
      </div>
    )
  }

  return (
    <div className="offers-carousel-wrapper">
      {/* Header controls - only visible if more than 1 offer */}
      {offers.length > 1 && (
        <div className="offers-carousel-header">
          <div className="offers-carousel-nav-controls">
            <button
              type="button"
              className="carousel-control-btn"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Oferta anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="carousel-control-btn"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Siguiente oferta"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Carousel track */}
      <div className="offers-carousel-track" ref={scrollRef}>
        {offers.map((offer, idx) => {
          const defaultMessage = `Hola Soleando, me interesa la oferta de ${offer.title}`
          const waText = encodeURIComponent(offer.whatsappText || defaultMessage)
          const waUrl = `https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0&text=${waText}`

          const formattedPrice = formatPriceValue(offer.price)
          const formattedOldPrice = formatPriceValue(offer.oldPrice)
          const currency = offer.currency || 'USD'

          return (
            <article className="carousel-offer-card group" key={offer.id || idx}>
              <div className="carousel-offer-image">
                <Image
                  src={offer.imageUrl}
                  alt={offer.title}
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 380px"
                  className="carousel-img"
                />
                <div className="carousel-image-overlay" />

                {offer.badge && (
                  <span className="carousel-offer-badge">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    {offer.badge}
                  </span>
                )}
                {offer.dateLabel && (
                  <span className="carousel-offer-tag">
                    <Calendar className="w-3 h-3 text-yellow-400" />
                    {offer.dateLabel}
                  </span>
                )}
              </div>

              <div className="carousel-offer-body">
                <div className="carousel-offer-top">
                  <span className="carousel-offer-cat" title={`${offer.category} · ${offer.destination}`}>
                    <MapPin className="w-3 h-3 inline-block shrink-0 text-[#f64d0b]" />
                    <span className="truncate">{offer.category} · {offer.destination}</span>
                  </span>
                  <h3 className="carousel-offer-title" title={offer.title}>
                    {offer.title}
                  </h3>
                  <p className="carousel-offer-desc" title={offer.description}>
                    {offer.description}
                  </p>
                </div>

                <div className="carousel-offer-includes">
                  {offer.includes && offer.includes.length > 0 ? (
                    offer.includes.slice(0, 3).map((inc, i) => (
                      <span key={i} className="carousel-include-item" title={inc}>
                        <Check className="w-3 h-3 text-[#f64d0b] shrink-0 stroke-[2.5]" />
                        <span className="truncate max-w-[200px]">{inc}</span>
                      </span>
                    ))
                  ) : (
                    <span className="carousel-include-item opacity-60">
                      <Check className="w-3 h-3 text-[#f64d0b] shrink-0" />
                      <span>Experiencia guiada</span>
                    </span>
                  )}
                </div>

                <div className="carousel-offer-footer">
                  <div className="carousel-offer-pricing">
                    {offer.price ? (
                      <>
                        <span className="pricing-from">Desde</span>
                        <div className="pricing-values">
                          <span className="pricing-currency">{currency}</span>
                          <strong className="pricing-main">${formattedPrice}</strong>
                          {formattedOldPrice && (
                            <span className="pricing-old">${formattedOldPrice}</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="pricing-ask">Consultar precio</span>
                    )}
                  </div>

                  <div className="carousel-offer-actions">
                    {offer.slug ? (
                      <Link
                        href={`/ofertas/${offer.slug}`}
                        className="carousel-btn-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Detalle</span>
                        <ArrowUpRightIcon className="w-3 h-3" />
                      </Link>
                    ) : null}
                    <a
                      href={waUrl}
                      className="carousel-btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Reservar ${offer.title} por WhatsApp`}
                    >
                      <span>Reservar</span>
                      <ArrowUpRightIcon className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Dots navigation */}
      {offers.length > 1 && (
        <div className="carousel-dots-container" aria-hidden="true">
          {offers.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir a la oferta ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
