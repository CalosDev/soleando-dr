'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Menu,
  User,
  ChevronDown,
  Hotel,
  ArrowRight,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { HOTEL_SEARCH_DESTINATIONS } from '@/features/hotels/config/search-destinations'
import { authClient } from '@/lib/auth-client'
import { MobileNavigation } from './mobile-navigation'

interface SiteHeaderProps {
  variant?: 'solid' | 'transparent'
}

export function SiteHeader({ variant = 'solid' }: SiteHeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isTransparent = variant === 'transparent'
  const isSolid = variant === 'solid' || isScrolled
  const isTransparentActive = isTransparent && !isScrolled

  const isRouteActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const getLinkClasses = (href: string) => {
    const active = isRouteActive(href)
    if (isTransparentActive) {
      return active
        ? 'bg-white/20 text-white font-bold shadow-xs'
        : 'text-white/85 hover:text-white hover:bg-white/10'
    }
    return active
      ? 'bg-white text-stone-900 shadow-xs font-bold'
      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
  }

  const chevronClasses = isTransparentActive
    ? 'text-white/70 group-hover:text-white'
    : 'text-stone-400 group-hover:text-stone-800'

  return (
    <>
      <header
        className={`w-full transition-all duration-300 z-40 ${
          isTransparent ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        } ${
          isTransparentActive
            ? 'bg-black/25 backdrop-blur-md border-b border-white/10 py-3 sm:py-3.5 shadow-lg shadow-black/10'
            : 'bg-[#fdfbf7]/95 backdrop-blur-md shadow-xs border-b border-[#ede8e1] py-2.5 sm:py-3'
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Brand Logo - Extreme Left */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className="flex items-center group shrink-0 transition-transform duration-200 hover:scale-102"
              aria-label="Soleando, volver al inicio"
            >
              <Image
                src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
                alt="Soleando Logo"
                width={180}
                height={50}
                className="h-11 sm:h-12 w-auto object-contain drop-shadow-xs transition-transform duration-300 group-hover:brightness-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop Capsule Navigation - Mathematically Centered */}
          <div className="hidden lg:flex items-center justify-center">
            <nav
              className={`flex items-center gap-1 rounded-full p-1 shadow-2xs backdrop-blur-md transition-all h-10 ${
                isTransparentActive
                  ? 'bg-black/35 hover:bg-black/45 border border-white/20 text-white'
                  : 'bg-stone-100/90 hover:bg-stone-100 border border-stone-200/80'
              }`}
              aria-label="Navegación principal"
            >
              {/* Inicio */}
              <Link
                href="/"
                className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${getLinkClasses('/')}`}
              >
                {isRouteActive('/') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
                )}
                <span>Inicio</span>
              </Link>

              {/* Hoteles (with interactive dropdown preview) */}
              <div className="relative group/hoteles">
                <Link
                  href="/hoteles"
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${getLinkClasses('/hoteles')}`}
                >
                  {isRouteActive('/hoteles') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
                  )}
                  <span>Hoteles</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 group-hover/hoteles:rotate-180 ${chevronClasses}`} />
                </Link>

                {/* Animated Dropdown Menu for Hoteles */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[420px] opacity-0 translate-y-2 pointer-events-none group-hover/hoteles:opacity-100 group-hover/hoteles:translate-y-0 group-hover/hoteles:pointer-events-auto transition-all duration-200 ease-out z-50">
                  <div className="bg-white rounded-3xl p-5 border border-[#ede8e1] shadow-2xl space-y-3 text-stone-900">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <Hotel className="w-3.5 h-3.5 text-[#f64d0b]" />
                        <span>Destinos de Alojamiento</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">
                        República Dominicana
                      </span>
                    </div>

                    {/* Destination items */}
                    <div className="grid grid-cols-2 gap-2">
                      {HOTEL_SEARCH_DESTINATIONS.slice(0, 4).map((dest) => (
                        <Link
                          key={dest.slug}
                          href={`/hoteles?destination=${dest.slug}`}
                          className="p-2.5 rounded-2xl hover:bg-[#fdfbf7] border border-transparent hover:border-[#ede8e1] transition-all group/item"
                        >
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <strong className="text-xs font-bold text-stone-900 group-hover/item:text-[#f64d0b] transition-colors">
                              {dest.name}
                            </strong>
                          </div>
                          <p className="text-[10px] text-stone-500 leading-tight line-clamp-2">
                            {dest.region}
                          </p>
                        </Link>
                      ))}
                    </div>

                    {/* Footer link to catalog */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <Link
                        href="/hoteles"
                        className="text-xs font-bold text-[#f64d0b] hover:text-[#d43d06] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Ver todas las opciones de hoteles</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/experiencias"
                className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${getLinkClasses('/experiencias')}`}
              >
                {isRouteActive('/experiencias') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
                )}
                <span>Excursiones</span>
              </Link>

              {/* Cruceros */}
              <Link
                href="/cruceros"
                className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${getLinkClasses('/cruceros')}`}
              >
                {isRouteActive('/cruceros') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
                )}
                <span>Cruceros</span>
              </Link>

              {/* Nosotros */}
              <Link
                href="/nosotros"
                className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${getLinkClasses('/nosotros')}`}
              >
                {isRouteActive('/nosotros') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
                )}
                <span>Nosotros</span>
              </Link>

              {/* Contacto */}
              <Link
                href="/contacto"
                className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${getLinkClasses('/contacto')}`}
              >
                {isRouteActive('/contacto') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
                )}
                <span>Contacto</span>
              </Link>
            </nav>
          </div>

          {/* Desktop Actions & Mobile Toggle - Extreme Right */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            {/* Account / Login Link */}
            <Link
              href={isAuthenticated ? '/cuenta' : '/login'}
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-5 rounded-full font-bold text-[13px] text-white bg-gradient-to-r from-[#f64d0b] via-[#ff8438] to-[#ff954f] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_20px_rgba(246,77,11,0.3)] border border-white/20 relative overflow-hidden group"
            >
              {/* Brillo decorativo al hacer hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              
              {isAuthenticated ? (
                <span className="w-2 h-2 rounded-full bg-white shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.8)] relative z-10" />
              ) : (
                <User className="w-4 h-4 text-white relative z-10" />
              )}
              <span className="relative z-10 drop-shadow-sm">{isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'}</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden h-10 w-10 flex items-center justify-center rounded-full transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#f64d0b] ${
                isTransparentActive
                  ? 'text-white hover:bg-white/15 border border-white/20'
                  : 'text-stone-800 hover:bg-stone-100 border border-stone-200/80'
              }`}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
      />
    </>
  )
}
