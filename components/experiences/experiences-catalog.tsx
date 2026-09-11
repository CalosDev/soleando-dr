'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Experience, ExperienceScope } from '@/features/catalog/types'
import { useDragScroll } from '@/lib/hooks/use-drag-scroll'
import { RevealContainer } from '@/components/motion/reveal-container'
import {
  Search,
  MapPin,
  Clock,
  Sparkles,
  Star,
  SlidersHorizontal,
  X,
  Compass,
  ArrowRight,
} from 'lucide-react'
import { ArrowUpRightIcon } from '@/components/icons'

interface ExperiencesCatalogProps {
  initialExperiences: Experience[]
}

export function ExperiencesCatalog({ initialExperiences }: ExperiencesCatalogProps) {
  const dragScrollRef = useDragScroll<HTMLDivElement>()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedScope, setSelectedScope] = useState<ExperienceScope | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [selectedDestination, setSelectedDestination] = useState<string>('all')
  const [selectedDuration, setSelectedDuration] = useState<string>('all')

  // Unique destinations list from data
  const destinations = useMemo(() => {
    const set = new Set(initialExperiences.map((e) => e.destination.split('/')[0].trim()))
    return Array.from(set)
  }, [initialExperiences])

  const categories = useMemo(() => {
    return ['Todos', ...Array.from(new Set(initialExperiences.map((experience) => experience.category).filter(Boolean)))]
  }, [initialExperiences])

  const durations = useMemo(() => {
    return Array.from(new Set(initialExperiences.map((experience) => experience.duration).filter(Boolean)))
  }, [initialExperiences])

  const scopeOptions = [
    { value: 'all' as const, label: 'Todos' },
    { value: 'national' as const, label: 'Nacionales' },
    { value: 'international' as const, label: 'Internacionales' },
    { value: 'package' as const, label: 'Paquetes' },
  ]

  const scopeCounts = useMemo(() => {
    const counts: Record<ExperienceScope | 'all', number> = {
      all: initialExperiences.length,
      national: 0,
      international: 0,
      package: 0,
    }
    for (const experience of initialExperiences) {
      counts[experience.scope ?? 'package'] += 1
    }
    return counts
  }, [initialExperiences])

  // Count of experiences per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: initialExperiences.length,
    }
    for (const exp of initialExperiences) {
      counts[exp.category] = (counts[exp.category] || 0) + 1
    }
    return counts
  }, [initialExperiences])

  // Filtered list
  const filteredExperiences = useMemo(() => {
    return initialExperiences.filter((exp) => {
      if (selectedScope !== 'all' && (exp.scope ?? 'package') !== selectedScope) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'Todos' && exp.category !== selectedCategory) {
        return false
      }

      // Destination filter
      if (selectedDestination !== 'all') {
        const destMatch = exp.destination.toLowerCase().includes(selectedDestination.toLowerCase())
        if (!destMatch) return false
      }

      // Duration filter
      if (selectedDuration !== 'all') {
        if (exp.duration !== selectedDuration) return false
      }

      // Search query (matches title, destination, category, or description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = exp.title.toLowerCase().includes(query)
        const matchDest = exp.destination.toLowerCase().includes(query)
        const matchCat = exp.category.toLowerCase().includes(query)
        const matchDesc = exp.description.toLowerCase().includes(query)

        if (!matchTitle && !matchDest && !matchCat && !matchDesc) {
          return false
        }
      }

      return true
    })
  }, [initialExperiences, selectedScope, selectedCategory, selectedDestination, selectedDuration, searchQuery])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedScope !== 'all' ||
    selectedCategory !== 'Todos' ||
    selectedDestination !== 'all' ||
    selectedDuration !== 'all'

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedScope('all')
    setSelectedCategory('Todos')
    setSelectedDestination('all')
    setSelectedDuration('all')
  }

  return (
    <div className="space-y-8">
      {/* Controls Container: Search & Filters */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ede8e1] shadow-xl shadow-stone-900/10 backdrop-blur-xs space-y-4">
        {/* Top search & selectors row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por destino, actividad o nombre"
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1] text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f64d0b] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full"
                aria-label="Borrar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Destination Selector */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full pl-11 pr-8 py-3 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1] text-sm text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#f64d0b] appearance-none cursor-pointer"
            >
              <option value="all">Todos los destinos</option>
              {destinations.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selector */}
          <div className="md:col-span-3 relative">
            <Clock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full pl-11 pr-8 py-3 rounded-2xl bg-[#fdfbf7] border border-[#ede8e1] text-sm text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#f64d0b] appearance-none cursor-pointer"
            >
              <option value="all">Cualquier duración</option>
              {durations.map((duration) => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[#ede8e1] pt-4" aria-label="Filtrar por tipo de viaje">
          {scopeOptions.map((scope) => {
            const isSelected = selectedScope === scope.value
            return (
              <button
                key={scope.value}
                type="button"
                onClick={() => setSelectedScope(scope.value)}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f64d0b] ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'border border-[#ede8e1] bg-[#fdfbf7] text-stone-700 hover:border-stone-300 hover:bg-stone-100'
                }`}
              >
                <span>{scope.label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  {scopeCounts[scope.value]}
                </span>
              </button>
            )
          })}
        </div>

        {categories.length > 1 && (
          <>
            {/* Category Pills (Horizontal draggable & scrollable) */}
            <div
              ref={dragScrollRef}
              className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Tipo:</span>
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat
                const count = categoryCounts[cat] ?? 0
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-[#fdfbf7] text-stone-600 hover:bg-stone-200 border border-[#ede8e1]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-200/90 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="sm:hidden -mt-2 text-[11px] font-medium text-stone-400">
              Desliza para ver más categorías →
            </p>
          </>
        )}
      </div>

      {/* Results Counter & Active Filters Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
        <p className="text-xs sm:text-sm text-stone-600">
          Mostrando{' '}
          <strong className="text-stone-900 font-bold">
            {filteredExperiences.length}
          </strong>{' '}
          {filteredExperiences.length === 1 ? 'experiencia disponible' : 'experiencias disponibles'}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f64d0b] hover:text-[#e04408] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Restablecer todos los filtros</span>
          </button>
        )}
      </div>

      {/* Experience Cards Grid */}
      {filteredExperiences.length > 0 ? (
        <RevealContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={80}>
          {filteredExperiences.map((exp) => (
            <article
              key={exp.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#ede8e1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                <Link
                  href={`/experiencias/${exp.slug}`}
                  className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 block cursor-pointer"
                  aria-label={`Ver detalles de ${exp.title}`}
                >
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

                  {/* Glassmorphism Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
                    <div className="rounded-full border border-white/25 bg-stone-950/75 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
                      {exp.scope === 'national' ? 'Nacional' : exp.scope === 'international' ? 'Internacional' : 'Paquete'}
                    </div>
                    {exp.badge && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/95 to-orange-600/95 backdrop-blur-md text-white border border-white/25 shadow-md">
                        <Sparkles className="w-3 h-3 text-white" />
                        <span>{exp.badge}</span>
                      </div>
                    )}
                  </div>

                  {exp.rating > 0 && (
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-stone-900 border border-white/40 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-[#fadc40] text-[#fadc40]" />
                      <span>{exp.rating.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                    <span className="inline-flex items-center gap-1.5 bg-stone-900/65 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-medium shadow-xs">
                      <MapPin className="w-3 h-3 text-[#fadc40]" />
                      <span>{exp.destination}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-stone-900/65 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-medium shadow-xs">
                      <Clock className="w-3 h-3 text-stone-300" />
                      <span>{exp.duration}</span>
                    </span>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold text-[11px]">
                      <Compass className="w-3 h-3 text-stone-500" />
                      <span>{exp.category}</span>
                    </span>

                    {exp.rating > 0 && (
                      <div className="flex items-center gap-1 text-[#fadc40]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <strong className="text-stone-900 font-bold">
                          {exp.rating.toFixed(1)}
                        </strong>
                        {exp.reviewCount > 0 && (
                          <span className="text-stone-400 text-[11px]">({exp.reviewCount})</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-snug">
                    <Link
                      href={`/experiencias/${exp.slug}`}
                      className="hover:text-[#f64d0b] transition-colors"
                    >
                      {exp.title}
                    </Link>
                  </h2>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {exp.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Price & CTA */}
              <div className="p-6 pt-4 border-t border-[#ede8e1] flex items-center justify-between bg-stone-50/50">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                    Desde
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <strong className="text-xl font-serif text-stone-900 font-normal">
                      ${exp.priceFrom}{' '}
                      <span className="text-xs font-sans text-stone-500 font-normal">
                        USD
                      </span>
                    </strong>
                  </div>
                  {exp.priceRD > 0 && (
                    <span className="text-[11px] text-stone-500 font-medium block">
                      ~ RD$ {exp.priceRD.toLocaleString('es-DO')} / pers.
                    </span>
                  )}
                </div>

                <Link
                  href={`/experiencias/${exp.slug}`}
                  className="group/btn inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold bg-[#f64d0b] text-white hover:bg-[#e04408] transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-orange-500/25 hover:scale-105 shrink-0"
                >
                  <span>Ver detalles</span>
                  <ArrowUpRightIcon className="w-3 h-3 text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </RevealContainer>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-[#ede8e1] space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-[#f64d0b]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 font-normal">
            {initialExperiences.length === 0 ? 'Estamos preparando nuevas experiencias' : 'No se encontraron excursiones'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            {initialExperiences.length === 0
              ? 'Publicaremos aquí excursiones nacionales, internacionales y paquetes con información confirmada. Mientras tanto, cuéntanos qué experiencia buscas.'
              : 'No encontramos ninguna actividad que coincida con tus criterios de búsqueda. Prueba con otros términos o limpia los filtros.'}
          </p>
          <div className="pt-2">
            {initialExperiences.length === 0 ? (
              <Link
                href="/contacto"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f64d0b] px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-[#e04408]"
              >
                <span>Consultar con Soleando</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <span>Restablecer filtros</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
