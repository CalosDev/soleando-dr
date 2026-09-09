import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react'

interface Review {
  id: string
  author: string
  origin: string
  experience: string
  rating: number
  date: string
  avatarColor: string
  initials: string
  content: string
  highlight: string
}

const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Familia Méndez',
    origin: 'Santo Domingo, RD',
    experience: 'Resort todo incluido en Punta Cana',
    rating: 5,
    date: 'Hace 2 semanas',
    avatarColor: 'bg-emerald-600',
    initials: 'FM',
    highlight: 'Atención 10/10 de principio a fin',
    content:
      'Reservamos un fin de semana largo en Lopesan Costa Bávaro con Soleando. Nos consiguieron una tarifa mucho mejor que en las plataformas internacionales y la habitación familiar estaba lista a la hora acordada. La atención por WhatsApp fue inmediata cuando tuvimos una duda con el check-in.',
  },
  {
    id: '2',
    author: 'Sofía & Mateo G.',
    origin: 'Madrid, España',
    experience: 'Isla Saona Catamarán VIP',
    rating: 5,
    date: 'Hace 1 mes',
    avatarColor: 'bg-[#f64d0b]',
    initials: 'SM',
    highlight: 'Puntualidad y comida excelente',
    content:
      'Teníamos recelo de contratar excursiones por internet sin conocer la agencia, pero el equipo de Soleando nos transmitió confianza desde el primer audio. El transporte nos recogió a tiempo en el lobby del hotel, el catamarán estaba impecable y la langosta en la playa privada estuvo deliciosa.',
  },
  {
    id: '3',
    author: 'Javier Almonte',
    origin: 'Santiago de los Caballeros, RD',
    experience: 'Buggies Macao & Cenote Taíno',
    rating: 5,
    date: 'Hace 3 semanas',
    avatarColor: 'bg-amber-600',
    initials: 'JA',
    highlight: 'Aventura segura y divertida',
    content:
      'Fuimos en grupo de amigos para celebrar un cumpleaños. Los buggies estaban en óptimas condiciones, los guías mantuvieron la seguridad en todo momento y el baño en la cueva fue increíble. Se nota la selección cuidadosa de proveedores.',
  },
  {
    id: '4',
    author: 'Laura & Roberto C.',
    origin: 'Bogotá, Colombia',
    experience: 'Crucero Antillas & Caribe Sur',
    rating: 5,
    date: 'Hace 1 mes',
    avatarColor: 'bg-blue-600',
    initials: 'LR',
    highlight: 'Nos resolvieron cada detalle',
    content:
      'Primera vez que hacíamos un crucero zarpando desde La Romana. Soleando nos coordinó el traslado privado desde el aeropuerto de Santo Domingo hasta el puerto sin un solo contratiempo. Viajar con respaldo local hace toda la diferencia.',
  },
]

export function CustomerReviews() {
  return (
    <section className="py-20 lg:py-24 bg-stone-50 border-t border-b border-stone-200/80 content-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#f64d0b]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experiencias Reales</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
              Viajeros que descubrieron el Caribe con Soleando
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl">
              Cientos de familias, parejas y grupos confían en nosotros para sus vacaciones en República Dominicana.
            </p>
          </div>

          {/* Calificación Global */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs shrink-0">
            <div className="text-center">
              <span className="text-3xl font-serif font-bold text-stone-900 block leading-none">
                4.9
              </span>
              <span className="text-[11px] text-stone-500 font-medium">de 5.0</span>
            </div>
            <div className="border-l border-stone-200 pl-4 space-y-1">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-stone-700">
                +1,200 viajeros atendidos
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Reseñas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Estrellas y Fecha */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">{review.date}</span>
                </div>

                {/* Destacado */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                    <Quote className="w-3.5 h-3.5 text-[#f64d0b] shrink-0" />
                    <span className="line-clamp-1">{review.highlight}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    &ldquo;{review.content}&rdquo;
                  </p>
                </div>
              </div>

              {/* Pie de tarjeta con autor y experiencia */}
              <div className="pt-5 mt-5 border-t border-stone-100 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${review.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {review.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-xs font-bold text-stone-900 truncate">
                      {review.author}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">{review.origin}</p>
                  <p className="text-[10px] font-medium text-[#f64d0b] truncate mt-0.5">
                    {review.experience}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
