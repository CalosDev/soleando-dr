import { HeartHandshake, ShieldCheck, Sparkles, Headphones } from 'lucide-react'

const REASONS = [
  {
    icon: HeartHandshake,
    title: 'Atención cercana y personalizada',
    description: 'No somos un buscador impersonal. Detrás de cada recomendación hay un equipo dominicano apasionado que cuida cada detalle de tu viaje.',
  },
  {
    icon: Headphones,
    title: 'Acompañamiento 1 a 1 por WhatsApp',
    description: 'Resolvemos dudas al instante, gestionamos solicitudes especiales en el hotel y estamos a un mensaje de distancia antes y durante tu viaje.',
  },
  {
    icon: Sparkles,
    title: 'Hoteles y experiencias verificadas',
    description: 'Seleccionamos únicamente propiedades y tours que conocemos y recomendaríamos a nuestra propia familia.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparencia y tranquilidad',
    description: 'Precios claros sin sorpresas ni comisiones ocultas al llegar al destino. Reserva con respaldo y confianza.',
  },
]

export function WhySoleando() {
  return (
    <section className="py-20 lg:py-28 bg-[#fdfbf7] content-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#f64d0b] bg-orange-50 border border-orange-200/60 font-sans">
            <span>¿Por qué viajar con nosotros?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal leading-tight">
            Viajar con Soleando se siente<br />
            <em className="text-[#f64d0b] italic font-serif">como viajar con amigos locales.</em>
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto">
            Combinamos la facilidad de una plataforma moderna con la calidez y el servicio que mereces en tus vacaciones.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-[#ede8e1] shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f64d0b] flex items-center justify-center border border-orange-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl text-stone-900 font-normal leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.description}
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
