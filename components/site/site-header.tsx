'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Menu,
  ArrowUpRight,
  User,
  ChevronDown,
  MapPin,
  Compass,
  Sparkles,
  Hotel,
  ArrowRight,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { WhatsappIcon } from '@/components/icons'
import { authClient } from '@/lib/auth-client'
import { MobileNavigation } from './mobile-navigation'

interface SiteHeaderProps {
  variant?: 'solid' | 'transparent'
}

// Quick destinations preview for Hoteles dropdown
const FEATURED_DESTINATIONS = [
  {
    name: 'Punta Cana',
    slug: 'punta-cana',
    description: 'Resorts Todo Incluido & Playas Blancas',
    tag: 'Más popular',
  },
  {
    name: 'Bayahíbe',
    slug: 'bayahibe',
    description: 'Mar Caribe, Buceo & Catamarán Saona',
    tag: 'Familiar',
  },
  {
    name: 'Samaná',
    slug: 'samana',
    description: 'Cascadas, Selvas & Naturaleza Virgen',
    tag: 'Ecoturismo',
  },
  {
    name: 'Puerto Plata',
    slug: 'puerto-plata',
    description: 'Costa Dorada, Cultura & Teleférico',
    tag: 'Tradición',
  },
]

// Quick experiences preview for Experiencias dropdown
const FEATURED_EXPERIENCES = [
  {
    title: 'Isla Saona en Catamarán VIP',
    slug: 'isla-saona-catamaran-vip',
    duration: 'Día completo',
    price: '$89 USD',
    badge: 'Top ventas',
  },
  {
    title: 'Montaña Redonda & Buggies 4x4',
    slug: 'montana-redonda-buggies-4x4',
    duration: 'Medio día',
    price: '$75 USD',
    badge: 'Aventura',
  },
  {
    title: 'Cascada El Limón & Cayo Levantado',
    slug: 'cascada-el-limon-cayo-levantado',
    duration: 'Día completo',
    price: '$99 USD',
    badge: 'Naturaleza',
  },
]

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

  const isSolid = variant === 'solid' || isScrolled

  const isRouteActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isSolid
            ? 'bg-[#fdfbf7]/95 backdrop-blur-md shadow-xs border-b border-[#ede8e1] py-2.5 sm:py-3'
            : 'bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#ede8e1]/70 py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo with subtle hover micro-interaction */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0 transition-transform duration-200 hover:scale-102"
            aria-label="Soleando, volver al inicio"
          >
            <Image
              src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
              alt="Soleando Logo"
              width={160}
              height={48}
              className="h-9 sm:h-10 md:h-11 w-auto origin-left scale-[1.45] object-contain drop-shadow-xs transition-transform duration-300 group-hover:brightness-105"
              priority
            />
          </Link>

          {/* Desktop Capsule Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-stone-100/90 hover:bg-stone-100 border border-stone-200/80 rounded-full p-1 shadow-2xs backdrop-blur-md transition-all"
            aria-label="Navegación principal"
          >
            {/* Inicio */}
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isRouteActive('/')
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                  isRouteActive('/hoteles')
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {isRouteActive('/hoteles') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
                )}
                <span>Hoteles</span>
                <ChevronDown className="w-3 h-3 text-stone-400 group-hover/hoteles:text-stone-800 transition-transform duration-200 group-hover/hoteles:rotate-180" />
              </Link>

              {/* Animated Dropdown Menu for Hoteles */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[420px] opacity-0 translate-y-2 pointer-events-none group-hover/hoteles:opacity-100 group-hover/hoteles:translate-y-0 group-hover/hoteles:pointer-events-auto transition-all duration-200 ease-out z-50">
                <div className="bg-white rounded-3xl p-5 border border-[#ede8e1] shadow-2xl space-y-3">
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
                    {FEATURED_DESTINATIONS.map((dest) => (
                      <Link
                        key={dest.slug}
                        href={`/hoteles?destination=${dest.slug}`}
                        className="p-2.5 rounded-2xl hover:bg-[#fdfbf7] border border-transparent hover:border-[#ede8e1] transition-all group/item"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <strong className="text-xs font-bold text-stone-900 group-hover/item:text-[#f64d0b] transition-colors">
                            {dest.name}
                          </strong>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold">
                            {dest.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 leading-tight line-clamp-2">
                          {dest.description}
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

            {/* Experiencias (with interactive dropdown preview) */}
            <div className="relative group/exp">
              <Link
                href="/experiencias"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                  isRouteActive('/experiencias')
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {isRouteActive('/experiencias') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
                )}
                <span>Experiencias</span>
                <ChevronDown className="w-3 h-3 text-stone-400 group-hover/exp:text-stone-800 transition-transform duration-200 group-hover/exp:rotate-180" />
              </Link>

              {/* Animated Dropdown Menu for Experiencias */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[440px] opacity-0 translate-y-2 pointer-events-none group-hover/exp:opacity-100 group-hover/exp:translate-y-0 group-hover/exp:pointer-events-auto transition-all duration-200 ease-out z-50">
                <div className="bg-white rounded-3xl p-5 border border-[#ede8e1] shadow-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                      <Compass className="w-3.5 h-3.5 text-[#f64d0b]" />
                      <span>Excursiones Populares</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      <span>Guiadas</span>
                    </span>
                  </div>

                  {/* Experiences preview list */}
                  <div className="space-y-1.5">
                    {FEATURED_EXPERIENCES.map((exp) => (
                      <Link
                        key={exp.slug}
                        href={`/experiencias/${exp.slug}`}
                        className="p-2 rounded-2xl hover:bg-[#fdfbf7] border border-transparent hover:border-[#ede8e1] transition-all flex items-center justify-between gap-3 group/item"
                      >
                        <div className="space-y-0.5">
                          <strong className="text-xs font-bold text-stone-900 group-hover/item:text-[#f64d0b] transition-colors block">
                            {exp.title}
                          </strong>
                          <span className="text-[10px] text-stone-500 font-medium">
                            {exp.duration} · Desde <strong className="text-stone-800">{exp.price}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-[#f64d0b] font-bold shrink-0">
                          {exp.badge}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Footer link */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      href="/experiencias"
                      className="text-xs font-bold text-[#f64d0b] hover:text-[#d43d06] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Ver todas las excursiones</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Cruceros */}
            <Link
              href="/cruceros"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isRouteActive('/cruceros')
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              {isRouteActive('/cruceros') && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
              )}
              <span>Cruceros</span>
            </Link>

            {/* Nosotros */}
            <Link
              href="/nosotros"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isRouteActive('/nosotros')
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              {isRouteActive('/nosotros') && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
              )}
              <span>Nosotros</span>
            </Link>

            {/* Contacto */}
            <Link
              href="/contacto"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isRouteActive('/contacto')
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              {isRouteActive('/contacto') && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b] shrink-0" />
              )}
              <span>Contacto</span>
            </Link>
          </nav>

          {/* Desktop Actions & Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Account / Login Link */}
            <Link
              href={isAuthenticated ? '/cuenta' : '/login'}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-xs text-stone-700 hover:text-stone-950 bg-white/70 hover:bg-white border border-stone-200/80 hover:border-stone-300 shadow-2xs hover:shadow-xs transition-all duration-200 hover:scale-102"
            >
              {isAuthenticated ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              ) : (
                <User className="w-3.5 h-3.5 text-stone-500" />
              )}
              <span>{isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'}</span>
            </Link>

            {/* Planear viaje CTA (Animated Shimmer + Online live agent badge) */}
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#f64d0b] text-white hover:bg-[#e04408] shadow-sm hover:shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 animate-shimmer group"
            >
              {/* Online pulse indicator */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>

              <WhatsappIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
              <span>Planear viaje</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full text-stone-800 hover:bg-stone-100 border border-stone-200/80 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#f64d0b]"
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
