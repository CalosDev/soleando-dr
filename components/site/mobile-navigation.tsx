'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { siteConfig } from '@/config/site'

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <div className="mobile-navigation">
      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span aria-hidden="true">{isOpen ? '×' : '☰'}</span>
      </button>
      {isOpen && (
        <div className="mobile-menu-panel" id={menuId}>
          <nav aria-label="Navegación móvil">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>
            ))}
          </nav>
          <a className="site-button site-button-primary" href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
            Hablar por WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
