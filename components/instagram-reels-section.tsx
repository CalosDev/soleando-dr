'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ArrowUpRightIcon } from '@/components/icons'
import type { ManagedIgPost } from '@/lib/ig-feed-store'

const IG_PROFILE = 'https://www.instagram.com/soleandodr/'

function VerifiedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095F6" aria-hidden="true" style={{ display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle' }}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-4.2-4.2 1.4-1.4 2.8 2.8 6.8-6.8 1.4 1.4-8.2 8.2z" fill="#fff" />
      <path d="M12 0c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm-1.9 16.7l-4.2-4.2 1.4-1.4 2.8 2.8 6.8-6.8 1.4 1.4-8.2 8.2z" fill="#0095F6" />
    </svg>
  )
}

function HeartIcon({ liked, onClick }: { liked?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Me gusta"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={liked ? '#ff2e00' : 'none'}
        stroke={liked ? '#ff2e00' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'transform 0.15s ease', transform: liked ? 'scale(1.15)' : 'scale(1)' }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}

function CommentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function BookmarkIcon({ saved, onClick }: { saved?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Guardar"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={saved ? '#262626' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}

function PlayIcon() {
  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: '3px' }}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </div>
  )
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

type Props = {
  initialPosts?: ManagedIgPost[]
}

export function InstagramReelsSection({ initialPosts }: Props) {
  const [posts, setPosts] = useState<ManagedIgPost[]>(initialPosts || [])
  const [loading, setLoading] = useState(!initialPosts || initialPosts.length === 0)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({})
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) return
    fetch('/api/instagram-reels')
      .then((r) => r.json())
      .then((d: { posts: ManagedIgPost[] }) => {
        setPosts(d.posts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [initialPosts])

  const displayPosts = posts.slice(0, 6)

  const checkScrollLimits = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scrollPrev = () => {
    if (!carouselRef.current) return
    const width = carouselRef.current.clientWidth
    carouselRef.current.scrollBy({ left: -width, behavior: 'smooth' })
  }

  const scrollNext = () => {
    if (!carouselRef.current) return
    const width = carouselRef.current.clientWidth
    carouselRef.current.scrollBy({ left: width, behavior: 'smooth' })
  }

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleSave = (id: string) => {
    setSavedPosts((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section id="instagram" className="relative overflow-hidden bg-[var(--background)]">
      {/* Fondo sutil con la textura ilustrativa que acompaña al color sólido */}
      <div
        aria-hidden="true"
        className="soleando-pattern-layer pointer-events-none absolute inset-0 z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 8%, rgba(0,0,0,0.9) 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 8%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      <div className="section-shell relative z-10" style={{ paddingBottom: '90px' }}>
        {/* Header */}
        <div className="section-heading" style={{ marginBottom: '32px' }}>
          <div>
            <h2>
              Lo que estamos<br />
              <em>viviendo ahora.</em>
            </h2>
          </div>
        </div>

      {/* Relative Carousel Container with Side Navigation Arrows */}
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Floating Left Button */}
        {canScrollLeft && (
          <button
            onClick={scrollPrev}
            aria-label="Publicaciones anteriores"
            className="ig-nav-btn ig-nav-btn-left"
            style={{
              position: 'absolute',
              left: '-44px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ChevronLeft className="w-5 h-5 text-[#0f172a]" />
          </button>
        )}

        {/* Floating Right Button */}
        {canScrollRight && (
          <button
            onClick={scrollNext}
            aria-label="Siguientes publicaciones"
            className="ig-nav-btn ig-nav-btn-right"
            style={{
              position: 'absolute',
              right: '-44px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ChevronRight className="w-5 h-5 text-[#0f172a]" />
          </button>
        )}

        {/* Carousel Track */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '4/5',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 100%)',
                  animation: 'pulse 1.8s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : (
          <div
            ref={carouselRef}
            onScroll={checkScrollLimits}
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingBottom: '16px',
              paddingTop: '8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="ig-carousel-track"
          >
            {displayPosts.map((post) => {
              const imgSrc = post.thumbnail_url || post.media_url
              const isVideo = post.media_type === 'VIDEO'
              const isLiked = !!likedPosts[post.id]
              const isSaved = !!savedPosts[post.id]
              const likesCount = (post.likesCount || 1200) + (isLiked ? 1 : 0)

              return (
                <article
                  key={post.id}
                  className="ig-card-item"
                  style={{
                    scrollSnapAlign: 'start',
                    flexShrink: 0,
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* 1. Header Bar */}
                  <div
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      {/* IG Avatar with Gradient Ring */}
                      <div
                        style={{
                          padding: '2px',
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #fadc40 0%, #f8a815 25%, #f87a12 50%, #f64d0b 75%, #ff2e00 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '2px solid #fff',
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          <Image
                            src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
                            alt="Soleando DR Avatar"
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                          soleandodr
                          <VerifiedIcon />
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '-1px' }}>
                          {post.location || 'República Dominicana'}
                        </span>
                      </div>
                    </div>

                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#9ca3af', fontSize: '16px', textDecoration: 'none', padding: '2px 6px' }}
                      aria-label="Opciones"
                    >
                      •••
                    </a>
                  </div>

                  {/* 2. Media Area (Square 1:1) */}
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      background: '#111827',
                      display: 'block',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={imgSrc}
                      alt={post.caption ? post.caption.slice(0, 80) : 'Instagram Post @soleandodr'}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />

                    {/* Reel Badge */}
                    {isVideo && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(0,0,0,0.65)',
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 7px',
                          borderRadius: '5px',
                          backdropFilter: 'blur(4px)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        REEL
                      </div>
                    )}

                    {/* Central Play Icon for Videos */}
                    {isVideo && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PlayIcon />
                      </div>
                    )}
                  </a>

                  {/* 3. Action Bar */}
                  <div style={{ padding: '10px 14px 12px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <HeartIcon liked={isLiked} onClick={() => toggleLike(post.id)} />
                        <a
                          href={post.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
                        >
                          <CommentIcon />
                        </a>
                        <a
                          href={post.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
                        >
                          <ShareIcon />
                        </a>
                      </div>
                      <BookmarkIcon saved={isSaved} onClick={() => toggleSave(post.id)} />
                    </div>

                    {/* Likes counter */}
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                      {likesCount.toLocaleString('es-DO')} me gusta
                    </div>

                    {/* 4. Caption */}
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#374151',
                        lineHeight: '1.4',
                        marginBottom: '8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '36px',
                      }}
                    >
                      <strong style={{ color: '#111827', marginRight: '5px' }}>soleandodr</strong>
                      {post.caption || 'Publicación oficial en Instagram'}
                    </div>

                    {/* IG Link & Timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#f64d0b',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        Ver en Instagram <ArrowUpRightIcon className="w-3 h-3 ml-0.5 inline-block" />
                      </a>
                      <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        PÚBLICO
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Big IG Follow CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '36px' }}>
        <a
          href={IG_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 34px',
            background: 'linear-gradient(135deg, #fadc40 0%, #f8a815 25%, #f87a12 50%, #f64d0b 75%, #ff2e00 100%)',
            color: '#fffffe',
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.03em',
            borderRadius: '50px',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 6px 24px rgba(246,77,11,0.35)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 10px 32px rgba(246,77,11,0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(246,77,11,0.35)'
          }}
        >
          <InstagramIcon size={20} />
          Síguenos en @soleandodr
        </a>
      </div>
      </div>

      <style>{`
        .ig-carousel-track::-webkit-scrollbar {
          display: none;
        }
        .ig-card-item {
          width: calc((100% - 40px) / 3);
        }
        @media (max-width: 1024px) {
          .ig-card-item {
            width: calc((100% - 20px) / 2);
          }
        }
        @media (max-width: 1200px) {
          .ig-nav-btn-left {
            left: -20px !important;
          }
          .ig-nav-btn-right {
            right: -20px !important;
          }
        }
        @media (max-width: 640px) {
          .ig-card-item {
            width: 85%;
          }
          .ig-nav-btn-left {
            left: -8px !important;
          }
          .ig-nav-btn-right {
            right: -8px !important;
          }
        }
        .ig-nav-btn:hover {
          background: #f64d0b !important;
          color: #fffffe !important;
          border-color: #f64d0b !important;
          transform: translateY(-50%) scale(1.08) !important;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}
