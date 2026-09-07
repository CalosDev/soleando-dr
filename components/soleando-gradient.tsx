import React from 'react'

interface SoleandoTextProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Componente de texto con el degradado oficial de "Soleando"
 * (Amarillo sol -> Naranja vibrante -> Rojo anaranjado)
 */
export function SoleandoGradientText({
  className = '',
  children = 'Soleando',
}: SoleandoTextProps) {
  return (
    <span
      className={`bg-gradient-to-b from-[#FFE600] via-[#FF6B00] to-[#E52300] bg-clip-text text-transparent inline-block font-bold ${className}`}
    >
      {children}
    </span>
  )
}

/**
 * Definición reusable de <linearGradient> para usar dentro de <svg>
 */
export function SoleandoSvgGradientDef({ id = 'soleandoGradient' }: { id?: string }) {
  return (
    <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFE600" />
      <stop offset="52%" stopColor="#FF6B00" />
      <stop offset="100%" stopColor="#E52300" />
    </linearGradient>
  )
}
