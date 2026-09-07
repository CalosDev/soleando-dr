import Link from 'next/link'
import { HeroCinematicScroll } from '@/components/hero-cinematic-scroll'
import { OffersCarousel, type CarouselOffer } from '@/components/offers-carousel'
import { getPublishedOffers } from '@/app/actions/offers'
import { InstagramReelsSection } from '@/components/instagram-reels-section'
import { GsapScrollAnimations } from '@/components/gsap-scroll-animations'

const defaultOffers: CarouselOffer[] = [
  {
    id: 'peru-semana-santa-2027',
    slug: 'peru-unico-semana-santa-2027',
    title: 'Perú Único – Semana Santa 2027',
    destination: 'Lima, Cusco & Machu Picchu',
    category: 'Viajes',
    description: 'Esta Semana Santa vive 9 días descubriendo lo mejor de Perú, desde la gastronomía de Lima hasta la magia de Cusco, el Valle Sagrado y Machu Picchu.',
    price: '2280',
    oldPrice: '2450',
    currency: 'USD',
    badge: 'Semana Santa',
    dateLabel: '21 al 29 de marzo 2027',
    includes: ['Vuelos incluidos', '8 noches de hotel', 'Machu Picchu + Tren'],
    imageUrl: '/soleando-peru.jpg',
    whatsappText: 'Hola Soleando, me interesa la oferta de Perú Único para Semana Santa 2027',
  },
  {
    id: 'oferta-saona-vip',
    slug: 'isla-saona-vip',
    title: 'Isla Saona VIP & Catamarán',
    destination: 'Bayahíbe',
    category: 'Full Day',
    description: 'Navega en catamarán privado, piscina natural con estrellas de mar y almuerzo buffet frente al mar caribeño.',
    price: '79',
    oldPrice: '99',
    currency: 'USD',
    badge: '20% OFF',
    dateLabel: 'Válido este mes',
    includes: ['Catamarán exclusivo', 'Almuerzo buffet', 'Bar abierto'],
    imageUrl: '/soleando-beach.png',
    whatsappText: 'Hola Soleando, quiero reservar la oferta de Isla Saona VIP con 20% OFF',
  },
  {
    id: 'oferta-sunset-cruise',
    slug: 'sunset-cruise-champagne',
    title: 'Sunset Cruise & Champagne',
    destination: 'Punta Cana',
    category: 'Experiencia Privada',
    description: 'Atardecer dorado navegando la costa, música suave y brindis exclusivo al caer el sol caribeño.',
    price: '65',
    oldPrice: '85',
    currency: 'USD',
    badge: 'Más popular',
    dateLabel: 'Horario: 4:30 PM',
    includes: ['Brindis espumoso', 'Snacks gourmet', 'Puesta de sol'],
    imageUrl: '/soleando-sunset.png',
    whatsappText: 'Hola Soleando, me interesa la oferta de Sunset Cruise & Champagne',
  },
  {
    id: 'oferta-cascadas-aventura',
    slug: 'cascadas-jungla-safari',
    title: 'Cascadas & Jungla Safari',
    destination: 'Samaná',
    category: 'Ecoturismo',
    description: 'Senderos tropicales secretos, baño en cascadas cristalinas y deliciosa comida típica dominicana.',
    price: '89',
    oldPrice: '115',
    currency: 'USD',
    badge: 'Cupos limitados',
    dateLabel: 'Salidas diarias',
    includes: ['Transporte 4x4', 'Guía local experto', 'Almuerzo criollo'],
    imageUrl: '/soleando-waterfall.png',
    whatsappText: 'Hola Soleando, quiero aprovechar la oferta de Cascadas & Jungla Safari',
  },
]

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

export default async function Page() {
  let publishedOffers: CarouselOffer[] = []

  try {
    const dbOffers = await getPublishedOffers()
    if (dbOffers && dbOffers.length > 0) {
      publishedOffers = dbOffers.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        destination: item.destination,
        category: item.category,
        description: item.description,
        price: item.price,
        currency: item.currency || 'USD',
        dateLabel: item.dateLabel,
        includes: item.includes || [],
        imageUrl: item.imageUrl,
        badge: item.featured ? 'Destacado' : undefined,
        whatsappText: `Hola Soleando, me interesa la oferta de ${item.title}`,
      }))
    }
  } catch {
    // Si no hay base de datos conectada, usamos los datos por defecto
  }

  const carouselOffers =
    publishedOffers.length >= 3
      ? publishedOffers
      : [...publishedOffers, ...defaultOffers.slice(publishedOffers.length)]

  return (
    <main className="relative overflow-hidden">
      <GsapScrollAnimations />
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Soleando, inicio">
          <span className="brand-mark">S</span>
          <span>soleando</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#instagram">Instagram</a>
          <a href="#ofertas">Ofertas</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a
          className="header-cta"
          href="https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reserva ahora <Arrow />
        </a>
      </header>

      {/* Hero Principal Cinemático */}
      <HeroCinematicScroll />

      {/* Sección de Instagram */}
      <InstagramReelsSection />

      {/* Sección de Ofertas en Carrusel */}
      <section id="ofertas" className="offers-section section-shell">
        <div className="section-heading">
          <div>
            <h2>
              Escapadas con<br />
              <em>precios únicos.</em>
            </h2>
          </div>
          <Link className="text-link" href="/ofertas" target="_blank" rel="noopener noreferrer">
            Ver todas las ofertas <Arrow />
          </Link>
        </div>

        <OffersCarousel offers={carouselOffers} />
      </section>

      <section id="nosotros" className="intro section-shell">
        <div className="intro-grid">
          <h2>
            El Caribe se disfruta<br />
            <em>despacio.</em>
          </h2>
          <div>
            <p className="lead">
              Creemos que los mejores recuerdos no se planean demasiado. Se encuentran en una playa escondida, en una conversación en el barco y en ese momento exacto en que el sol toca el horizonte.
            </p>
            <p className="muted">
              Por eso creamos excursiones cercanas, cuidadas y llenas de esos pequeños detalles que hacen que quieras volver.
            </p>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-inner">
          <h2>
            Tu mejor día<br />
            <em>empieza aquí.</em>
          </h2>
          <a
            className="button button-outline"
            href="https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Planeemos tu aventura <Arrow />
          </a>
        </div>
      </section>

      <section id="contacto" className="contact section-shell">
        <div className="contact-grid">
          <div>
            <h2>
              ¿Listo para<br />
              <em>solearte?</em>
            </h2>
            <p className="lead">
              Escríbenos y te ayudamos a elegir la experiencia perfecta para ti.
            </p>
          </div>
          <div className="contact-links">
            <a
              className="contact-item"
              href="https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon">↗</span>
              <span>
                <small>Reserva por WhatsApp</small>
                <strong>Escríbenos directo</strong>
              </span>
              <Arrow />
            </a>
            <a
              className="contact-item"
              href="https://www.instagram.com/soleandodr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon">◎</span>
              <span>
                <small>Síguenos en Instagram</small>
                <strong>@soleandodr</strong>
              </span>
              <Arrow />
            </a>
            <a className="contact-item" href="#contacto">
              <span className="contact-icon">⌖</span>
              <span>
                <small>Encuéntranos en</small>
                <strong>República Dominicana</strong>
              </span>
              <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer>
        <a className="brand" href="#inicio">
          <span className="brand-mark">S</span>
          <span>soleando</span>
        </a>
        <p>Excursiones que se quedan contigo.</p>
        <span>© 2026 Soleando</span>
      </footer>
    </main>
  )
}
