'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    // 1. Registro del Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Soleando PWA Service Worker registrado con éxito:', reg.scope)
          })
          .catch((err) => {
            console.error('Error al registrar Service Worker:', err)
          })
      })
    }

    // 2. Manejo del evento de instalación PWA (Chrome / Android / Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Mostrar el banner solo si el usuario no lo descartó en esta sesión
      const isDismissed = sessionStorage.getItem('soleando_pwa_dismissed')
      if (!isDismissed) {
        // Mostrar con un breve retraso para no interrumpir la experiencia inicial
        const timer = setTimeout(() => {
          setShowInstallBanner(true)
        }, 3500)
        return () => clearTimeout(timer)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('Soleando PWA instalada por el usuario')
    }
    setDeferredPrompt(null)
    setShowInstallBanner(false)
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    sessionStorage.setItem('soleando_pwa_dismissed', 'true')
  }

  if (!showInstallBanner || !deferredPrompt) return null

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-sm w-[calc(100vw-40px)] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3.5 p-3.5 bg-[#1c1917]/95 text-white border border-[#fadc40]/30 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE600] to-[#FF6B00] flex items-center justify-center font-bold text-[#1c1917] shrink-0 text-lg shadow-md font-serif">
          S
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-white truncate">Soleando App</p>
          <p className="text-[11px] text-white/70 truncate">Instala la app para una mejor experiencia</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFE600] to-[#FF6B00] text-[#1c1917] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Instalar</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar aviso de instalación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
