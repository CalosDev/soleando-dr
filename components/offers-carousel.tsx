'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
      const cardWidth = card.offsetWidth + 24 // card width + gap
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
    const step = card ? card.offsetWidth + 24 : 360

    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    })
  }

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current
    if (!el) return

    const card = el.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 24 : 360

    el.scrollTo({
      left: step * index,
      behavior: 'smooth',
    })
  }

  if (!offers || offers.length === 0) {
    return null
  }

  return (
    <div className="offers-carousel-wrapper">
      {/* Header controls */}
      <div className="offers-carousel-header">
        <div className="offers-carousel-nav-controls">
          <button
            type="button"
            className="carousel-control-btn"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Oferta anterior"
          >
            ←
          </button>
          <button
            type="button"
            className="carousel-control-btn"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Siguiente oferta"
          >
            →
          </button>
        </div>
      </div>

      {/* Carousel track */}
      <div className="offers-carousel-track" ref={scrollRef}>
        {offers.map((offer, idx) => {
          const defaultMessage = `Hola Soleando, me interesa la oferta de ${offer.title}`
          const waText = encodeURIComponent(offer.whatsappText || defaultMessage)
          const waUrl = `https://wa.me/10000000000?text=${waText}`

          return (
            <article className="carousel-offer-card" key={offer.id || idx}>
              <div className="carousel-offer-image">
                <Image
                  src={offer.imageUrl}
                  alt={offer.title}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 360px"
                  className="carousel-img"
                />
                {offer.badge && (
                  <span className="carousel-offer-badge">{offer.badge}</span>
                )}
                {offer.dateLabel && (
                  <span className="carousel-offer-tag">{offer.dateLabel}</span>
                )}
              </div>

              <div className="carousel-offer-body">
                <div className="carousel-offer-top">
                  <span className="carousel-offer-cat">
                    {offer.category} · {offer.destination}
                  </span>
                  <h3 className="carousel-offer-title">{offer.title}</h3>
                  <p className="carousel-offer-desc">{offer.description}</p>
                </div>

                {offer.includes && offer.includes.length > 0 && (
                  <div className="carousel-offer-includes">
                    {offer.includes.slice(0, 3).map((inc, i) => (
                      <span key={i} className="carousel-include-item">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                )}

                <div className="carousel-offer-footer">
                  <div className="carousel-offer-pricing">
                    {offer.price ? (
                      <>
                        <span className="pricing-from">Desde</span>
                        <div className="pricing-values">
                          <strong className="pricing-main">
                            {offer.currency || 'USD'} ${offer.price}
                          </strong>
                          {offer.oldPrice && (
                            <span className="pricing-old">
                              ${offer.oldPrice}
                            </span>
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
                        Detalle ↗
                      </Link>
                    ) : null}
                    <a
                      href={waUrl}
                      className="carousel-btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Reservar ${offer.title} por WhatsApp`}
                    >
                      Reservar ↗
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
