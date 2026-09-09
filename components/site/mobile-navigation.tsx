'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  X,
  ArrowUpRight,
  User,
  Home,
  Hotel,
  Compass,
  Ship,
  Users,
  PhoneCall,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { WhatsappIcon } from '@/components/icons'

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
}

const NAV_ICONS: Record<string, typeof Home> = {
  '/': Home,
  '/hoteles': Hotel,
  '/experiencias': Compass,
  '/cruceros': Ship,
  '/nosotros': Users,
  '/contacto': PhoneCall,
}

export function MobileNavigation({ isOpen, onClose, isAuthenticated }: MobileNavigationProps) {
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Scroll lock when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const isRouteActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú principal de navegación"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-xs h-full bg-[#fdfbf7] text-[#1c1917] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        <div>
          {/* Header with logo & close button */}
          <div className="flex items-center justify-between pb-5 border-b border-[#ede8e1]">
            <Link href="/" onClick={onClose} className="flex items-center" aria-label="Soleando, volver al inicio">
              <Image
                src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
                alt="Soleando Logo"
                width={140}
                height={42}
                className="h-9 w-auto origin-left scale-[1.45] object-contain"
              />
            </Link>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#f64d0b]"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="py-5 flex flex-col gap-1.5" aria-label="Enlaces de navegación móvil">
            {siteConfig.mainNav.map((item) => {
              const active = isRouteActive(item.href)
              const Icon = NAV_ICONS[item.href] || Compass

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-[#f64d0b] font-bold shadow-xs border border-[#ede8e1]'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-[#f64d0b]' : 'text-stone-400'}`} />
                    <span>{item.title}</span>
                  </div>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f64d0b]" />
                  )}
                </Link>
              )
            })}

            <div className="pt-3 mt-2 border-t border-stone-200/70">
              <Link
                href={isAuthenticated ? '/cuenta' : '/login'}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-stone-800 hover:text-[#f64d0b] hover:bg-stone-100 transition-colors"
              >
                <User className="w-4 h-4 text-stone-500" />
                <span>{isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'}</span>
                {isAuthenticated && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer actions inside drawer */}
        <div className="pt-6 border-t border-[#ede8e1] space-y-3">
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#f64d0b] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#e04408] transition-all animate-shimmer"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <WhatsappIcon className="w-4 h-4 text-white" />
            <span>Planear mi viaje</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/90" />
          </a>
          <p className="text-[11px] text-center text-stone-400">
            {siteConfig.location}
          </p>
        </div>
      </div>
    </div>
  )
}
