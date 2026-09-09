'use client'

import { WhatsappIcon, ArrowUpRightIcon } from '@/components/icons'
import { Sparkles } from 'lucide-react'

export interface StickyMobileBookingBarProps {
  title: string
  price: number | string
  currency?: string
  priceLabel?: string
  priceSubtitle?: string
  secondaryPrice?: string
  ctaText?: string
  whatsappUrl: string
}

export function StickyMobileBookingBar({
  title,
  price,
  currency = 'USD',
  priceLabel = 'Desde',
  priceSubtitle,
  secondaryPrice,
  ctaText = 'Reservar por WhatsApp',
  whatsappUrl,
}: StickyMobileBookingBarProps) {
  return (
    <aside
      aria-label={`Acceso rápido para reservar ${title}`}
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.09)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] print:hidden transition-transform duration-300"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Left: Price & Information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-stone-400">
            <span>{priceLabel}</span>
            {priceSubtitle && (
              <span className="text-stone-400 font-normal lowercase">
                • {priceSubtitle}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5">
            <strong className="font-serif text-2xl text-stone-900 font-normal leading-none tracking-tight">
              ${price}
            </strong>
            <span className="text-xs font-semibold text-stone-600">
              {currency}
            </span>
          </div>

          {secondaryPrice && (
            <p className="text-[11px] text-stone-500 font-medium truncate leading-tight pt-0.5">
              {secondaryPrice}
            </p>
          )}
        </div>

        {/* Right: CTA WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md active:scale-95 transition-all"
        >
          <WhatsappIcon className="w-4 h-4 text-white shrink-0" />
          <span className="truncate">{ctaText}</span>
          <ArrowUpRightIcon className="w-3 h-3 text-white shrink-0 hidden xs:inline-block" />
        </a>
      </div>
    </aside>
  )
}
