'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, User, Users } from 'lucide-react'

const navItems = [
  {
    title: 'Resumen',
    href: '/cuenta',
    exact: true,
    icon: LayoutDashboard,
  },
  {
    title: 'Mi Perfil',
    href: '/cuenta/perfil',
    exact: false,
    icon: User,
  },
  {
    title: 'Mis Viajeros',
    href: '/cuenta/viajeros',
    exact: false,
    icon: Users,
  },
]

export function AccountNavigation() {
  const pathname = usePathname()

  return (
    <nav
      className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-[#ede8e1] shadow-xs overflow-x-auto scrollbar-none mb-8"
      aria-label="Navegación de mi cuenta"
    >
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + '/')
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-[#f64d0b] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
