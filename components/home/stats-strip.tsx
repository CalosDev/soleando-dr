import { Users, Star, Compass, ShieldCheck } from 'lucide-react'

const STATS = [
  {
    icon: Users,
    value: '+12,000',
    label: 'Viajeros felices',
    description: 'Familias, parejas y grupos atendidos',
    iconColor: 'text-[#f64d0b]',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Star,
    value: '4.9 / 5',
    label: 'Calificación promedio',
    description: 'Reseñas verificadas de clientes',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Compass,
    value: '+50',
    label: 'Opciones en catálogo',
    description: 'Resorts y excursiones oficiales en RD',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Asistencia local garantizada',
    description: 'Acompañamiento 1 a 1 por WhatsApp',
    iconColor: 'text-sky-600',
    bgColor: 'bg-sky-50',
  },
]

export function StatsStrip() {
  return (
    <section
      aria-label="Métricas de confianza de Soleando DR"
      className="bg-[#f5f1ea]/80 border-y border-[#ede8e1] py-8 sm:py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5"
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${stat.bgColor} ${stat.iconColor} flex items-center justify-center shrink-0 shadow-2xs border border-black/5`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <div className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-800">
                    {stat.label}
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-500 hidden sm:block leading-snug">
                    {stat.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
