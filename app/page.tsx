import Link from 'next/link'
import Image from 'next/image'
import { HeroCinematicScroll } from '@/components/hero-cinematic-scroll'
import { OffersCarousel, type CarouselOffer } from '@/components/offers-carousel'
import { getPublishedOffers } from '@/app/actions/offers'
import { GsapScrollAnimations } from '@/components/gsap-scroll-animations'

import { ArrowUpRightIcon, WhatsappIcon, InstagramOutlineIcon, MapPinOutlineIcon } from '@/components/icons'

function Arrow() {
  return <ArrowUpRightIcon />
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
    // Si no hay base de datos conectada
  }

  const carouselOffers = publishedOffers

  return (
    <main className="relative overflow-hidden">
      <GsapScrollAnimations />
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Soleando, inicio">
          <Image 
            src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png" 
            alt="Soleando Logo" 
            width={200} 
            height={60} 
            className="h-12 md:h-16 w-auto object-contain drop-shadow-sm"
            style={{ width: "auto" }}
            priority
          />
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
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

      {/* Sección de Ofertas en Carrusel */}
      <section id="ofertas" className="relative overflow-hidden bg-[var(--background)]">
        {/* Fondo sutil con la textura ilustrativa que acompaña al color sólido */}
        <div
          aria-hidden="true"
          className="soleando-pattern-layer pointer-events-none absolute inset-0 z-0"
        />

        <div className="offers-section section-shell relative z-10">
          <div className="section-heading">
            <div>
              <h2>
                Escapadas con<br />
                <em>precios únicos.</em>
              </h2>
            </div>
          </div>

          <OffersCarousel offers={carouselOffers} />
          
          <div className="flex justify-center mt-12 mb-4">
            <Link
              className="view-all-offers-btn"
              href="/ofertas"
            >
              <span>Ver todas las ofertas</span>
              <span className="btn-arrow-circle">
                <Arrow />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section id="nosotros" className="nosotros-section relative overflow-hidden bg-[var(--background)]">
        {/* Fondo sutil con la textura ilustrativa que acompaña al color sólido */}
        <div
          aria-hidden="true"
          className="soleando-pattern-layer pointer-events-none absolute inset-0 z-0"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 88%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 88%, transparent 100%)',
          }}
        />

        <div className="intro section-shell relative z-10">
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
        </div>
      </section>

      <section className="manifesto relative overflow-hidden flex items-center">
        {/* Fondo SVG Ilustrativo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/alghozy-3FmAo4JBvLM-unsplash.svg"
            alt="Fondo ilustrativo"
            fill
            sizes="100vw"
            className="object-cover object-center pointer-events-none opacity-85"
          />
          {/* Overlay gradiente suave para contraste y legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917]/95 via-[#1c1917]/75 to-[#1c1917]/35 pointer-events-none" />
        </div>

        <div className="manifesto-inner relative z-10">
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

      <section id="contacto" className="relative overflow-hidden bg-[var(--background)]">
        {/* Fondo sutil con la textura ilustrativa que acompaña al color sólido */}
        <div
          aria-hidden="true"
          className="soleando-pattern-layer pointer-events-none absolute inset-0 z-0"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.9) 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.9) 100%)',
          }}
        />

        <div className="contact section-shell relative z-10">
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
                <span className="contact-icon">
                  <WhatsappIcon className="w-5 h-5" />
                </span>
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
                <span className="contact-icon">
                  <InstagramOutlineIcon className="w-5 h-5" />
                </span>
                <span>
                  <small>Síguenos en Instagram</small>
                  <strong>@soleandodr</strong>
                </span>
                <Arrow />
              </a>
              <a className="contact-item" href="#contacto">
                <span className="contact-icon">
                  <MapPinOutlineIcon className="w-5 h-5" />
                </span>
                <span>
                  <small>Encuéntranos en</small>
                  <strong>República Dominicana</strong>
                </span>
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer relative overflow-hidden bg-[var(--background)] border-t border-[var(--line)]">
        {/* Fondo sutil con la textura ilustrativa que acompaña al color sólido */}
        <div
          aria-hidden="true"
          className="soleando-pattern-layer pointer-events-none absolute inset-0 z-0"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.85) 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.85) 100%)',
          }}
        />

        <div className="footer-content relative z-10">
          <a className="brand" href="#inicio">
            <Image 
              src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png" 
              alt="Soleando Logo" 
              width={160} 
              height={48} 
              className="h-10 md:h-12 w-auto object-contain" 
              style={{ width: "auto" }}
            />
          </a>
          <p>Excursiones que se quedan contigo.</p>
          <span>© 2026 Soleando</span>
        </div>
      </footer>
    </main>
  )
}
