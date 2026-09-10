import Image from 'next/image'
import Link from 'next/link'
import { getExperiences } from '@/features/catalog/repository'
import { Compass, Clock, MapPin, Sparkles } from 'lucide-react'
import { ArrowUpRightIcon } from '@/components/icons'
import { RevealContainer } from '@/components/motion/reveal-container'

export async function ExperiencesSection() {
  const experiences = await getExperiences()

  return (
    <section className="py-20 lg:py-28 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f64d0b] mb-2 font-sans">
              <Compass className="w-3.5 h-3.5" />
              <span>Experiencias y Excursiones</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
              Vive momentos que<br />
              <em className="text-[#f64d0b] italic font-serif">se quedan contigo.</em>
            </h2>
          </div>

          <div className="space-y-2 max-w-md">
            <p className="text-sm sm:text-base text-stone-600">
              Combina tu estancia en hotel con excursiones cuidadas en catamarán, rutas de aventura, playas vírgenes y gastronomía local.
            </p>
            <Link
              href="/experiencias"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f64d0b] hover:text-[#d43d06] transition-colors"
            >
              <span>Ver todas las experiencias</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Experiences Grid */}
        <RevealContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={70}>
          {experiences.slice(0, 4).map((exp) => (
            <article
              key={exp.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#ede8e1] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <Link href={`/experiencias/${exp.slug}`} className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 block cursor-pointer" aria-label={`Ver detalles de ${exp.title}`}>
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  {exp.badge && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                      <Sparkles className="w-3 h-3 text-[#fadc40]" />
                      <span>{exp.badge}</span>
                    </div>
                  )}
                </Link>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#f64d0b]" />
                      <span>{exp.destination}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{exp.duration}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-stone-900 leading-snug group-hover:text-[#f64d0b] transition-colors line-clamp-2">
                    <Link href={`/experiencias/${exp.slug}`} className="hover:text-[#f64d0b] transition-colors">
                      {exp.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-[#ede8e1] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Desde</span>
                  <strong className="text-lg font-serif text-stone-900 font-normal">
                    ${exp.priceFrom} <span className="text-xs font-sans text-stone-500 font-normal">{exp.currency}</span>
                  </strong>
                </div>

                <Link
                  href={`/experiencias/${exp.slug}`}
                  className="group/btn inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-xs font-bold bg-[#f64d0b] text-white hover:bg-[#e04408] transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-orange-500/25 hover:scale-105 shrink-0"
                >
                  <span className="text-white font-bold">Ver detalles</span>
                  <ArrowUpRightIcon className="w-3 h-3 text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </RevealContainer>
      </div>
    </section>
  )
}
