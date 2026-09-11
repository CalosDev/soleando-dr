'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Maximize2,
} from 'lucide-react'

export interface GalleryImage {
  url: string
  alt?: string
  caption?: string
}

export interface InteractiveGalleryModalProps {
  images: GalleryImage[]
  title: string
  badgeText?: string
  badgeSubtitle?: string
}

export function InteractiveGalleryModal({
  images,
  title,
  badgeText,
  badgeSubtitle,
}: InteractiveGalleryModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, prevImage, nextImage])

  if (!images || images.length === 0) return null

  const primaryImage = images[0]
  const sideImages = images.slice(1, 3)

  return (
    <>
      {/* Visual In-Page Gallery Grid */}
      <section
        aria-label={`Galería fotográfica de ${title}`}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Main Image (Clickable) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => openLightbox(0)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openLightbox(0)
                }
              }}
              className="md:col-span-2 relative aspect-16/10 md:aspect-auto md:min-h-[440px] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-stone-100 cursor-pointer group"
              aria-label="Abrir imagen principal en pantalla completa"
            >
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {badgeText && (
                <div className="absolute bottom-6 left-6 text-white space-y-1 pointer-events-none">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#fadc40] block drop-shadow-xs">
                    {badgeText}
                  </span>
                  {badgeSubtitle && (
                    <p className="text-sm sm:text-base text-stone-200 font-medium drop-shadow-xs">
                      {badgeSubtitle}
                    </p>
                  )}
                </div>
              )}

              <div className="absolute top-4 right-4 md:hidden">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{images.length} fotos</span>
                </span>
              </div>
            </div>

            {/* Side Photos Grid (Clickable) */}
            <div className="hidden md:flex flex-col gap-4">
              {sideImages.map((photo, idx) => (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => openLightbox(idx + 1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openLightbox(idx + 1)
                    }
                  }}
                  className="relative flex-1 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xs bg-stone-100 cursor-pointer group min-h-[212px]"
                  aria-label={`Ver foto ${idx + 2} en pantalla completa`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.alt || `${title} foto ${idx + 2}`}
                    fill
                    sizes="33vw"
                    className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}

              {sideImages.length < 2 && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openLightbox(0)}
                  className="relative flex-1 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xs bg-stone-100 min-h-[212px] cursor-pointer group"
                >
                  <Image
                    src={primaryImage.url}
                    alt={title}
                    fill
                    sizes="33vw"
                    className="object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* "Ver todas las fotos" Trigger Button (Desktop & Tablet) */}
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-950/80 hover:bg-stone-900 text-white backdrop-blur-md text-xs font-bold shadow-lg border border-white/20 transition-all hover:scale-102 active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#fadc40]" />
            <span>Ver todas las fotos ({images.length})</span>
            <Maximize2 className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </section>

      {/* Lightbox Modal (Full Screen) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visor de fotos de ${title}`}
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Top Bar: Title, Counter & Close */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full pb-2">
            <div className="space-y-0.5 max-w-md sm:max-w-xl truncate">
              <h4 className="font-serif text-base sm:text-lg text-white font-normal truncate">
                {title}
              </h4>
              <p className="text-xs text-stone-400 font-medium">
                Foto {currentIndex + 1} de {images.length}
              </p>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Cerrar visor de fotos"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Stage: Photo & Navigation Arrows */}
          <div className="relative flex-1 flex items-center justify-center py-2 sm:py-4">
            {/* Left Nav Button */}
            <button
              type="button"
              onClick={prevImage}
              aria-label="Foto anterior"
              className="absolute left-2 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Current Active Image */}
            <div className="relative w-full max-w-5xl h-[60vh] sm:h-[68vh] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt || `${title} imagen ${currentIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Right Nav Button */}
            <button
              type="button"
              onClick={nextImage}
              aria-label="Foto siguiente"
              className="absolute right-2 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="max-w-4xl mx-auto w-full pt-2">
            <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-14 h-10 sm:w-18 sm:h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'border-[#f64d0b] scale-105 shadow-md ring-2 ring-[#f64d0b]/40'
                      : 'border-white/20 opacity-50 hover:opacity-90'
                  }`}
                  aria-label={`Ir a la foto ${idx + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `Miniatura ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
