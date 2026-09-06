import Image from 'next/image'

const tours = [
  { name: 'Isla Saona', label: 'El clásico que nunca falla', image: '/soleando-beach.png', description: 'Arena blanca, agua turquesa y un día para desconectar de todo.', meta: 'Día completo · Grupos pequeños' },
  { name: 'Cascadas & Jungla', label: 'Para los que buscan más', image: '/soleando-waterfall.png', description: 'Naturaleza en estado puro, senderos tropicales y agua fresca.', meta: 'Aventura · Guía local' },
  { name: 'Sunset en el mar', label: 'La hora dorada', image: '/soleando-sunset.png', description: 'Navega, brinda y mira cómo el Caribe se pinta de naranja.', meta: 'Media tarde · Experiencia privada' },
]

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

export default function Page() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Soleando, inicio"><span className="brand-mark">S</span><span>soleando</span></a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#experiencias">Experiencias</a><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a>
        </nav>
        <a className="header-cta" href="https://wa.me/10000000000?text=Hola%20Soleando%2C%20quiero%20reservar%20una%20excursi%C3%B3n">Reserva ahora <Arrow /></a>
      </header>

      <section id="inicio" className="hero">
        <Image className="hero-image" src="/soleando-hero.png" alt="Catamarán navegando hacia una playa caribeña" fill priority sizes="100vw" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light">Excursiones con alma caribeña</p>
          <h1>Sal de la rutina.<br /><em>Entra al paraíso.</em></h1>
          <p className="hero-copy">Tours pensados para vivir la República Dominicana de una forma auténtica, bonita y sin complicaciones.</p>
          <div className="hero-actions"><a className="button button-sun" href="https://wa.me/10000000000?text=Hola%20Soleando%2C%20quiero%20conocer%20sus%20tours">Quiero vivirlo <Arrow /></a><a className="text-link light" href="#experiencias">Explora las experiencias <span>↓</span></a></div>
        </div>
        <div className="hero-note"><span>01</span><span className="note-line" /><span>República Dominicana</span></div>
      </section>

      <section id="nosotros" className="intro section-shell">
        <div className="section-kicker"><span>01</span><span className="kicker-line" /><span>La esencia Soleando</span></div>
        <div className="intro-grid"><h2>El Caribe se disfruta<br /><em>despacio.</em></h2><div><p className="lead">Creemos que los mejores recuerdos no se planean demasiado. Se encuentran en una playa escondida, en una conversación en el barco y en ese momento exacto en que el sol toca el horizonte.</p><p className="muted">Por eso creamos excursiones cercanas, cuidadas y llenas de esos pequeños detalles que hacen que quieras volver.</p></div></div>
      </section>

      <section id="experiencias" className="tours section-shell">
        <div className="section-heading"><div><p className="eyebrow">Escoge tu próxima historia</p><h2>Experiencias que<br /><em>se sienten.</em></h2></div><a className="text-link" href="https://www.instagram.com/soleandodr/">Ver Instagram <Arrow /></a></div>
        <div className="tour-grid">{tours.map((tour, index) => <article className={`tour-card card-${index + 1}`} key={tour.name}><div className="tour-image"><Image src={tour.image} alt={tour.name} fill sizes="(max-width: 768px) 100vw, 33vw" /><span className="tour-number">0{index + 1}</span></div><div className="tour-info"><p className="tour-label">{tour.label}</p><h3>{tour.name}</h3><p>{tour.description}</p><div className="tour-meta"><span>{tour.meta}</span><a href="https://wa.me/10000000000?text=Hola%20Soleando%2C%20me%20interesa%20el%20tour%20de%20{encodeURIComponent(tour.name)}" aria-label={`Reservar ${tour.name}`}><Arrow /></a></div></div></article>)}</div>
      </section>

      <section className="manifesto"><div className="manifesto-inner"><p className="eyebrow light">Más que un tour</p><h2>Tu mejor día<br /><em>empieza aquí.</em></h2><a className="button button-outline" href="https://wa.me/10000000000?text=Hola%20Soleando%2C%20quiero%20planear%20mi%20aventura">Planeemos tu aventura <Arrow /></a></div></section>

      <section id="contacto" className="contact section-shell"><div className="section-kicker"><span>02</span><span className="kicker-line" /><span>Hablemos</span></div><div className="contact-grid"><div><h2>¿Listo para<br /><em>solearte?</em></h2><p className="lead">Escríbenos y te ayudamos a elegir la experiencia perfecta para ti.</p></div><div className="contact-links"><a className="contact-item" href="https://wa.me/10000000000"><span className="contact-icon">↗</span><span><small>Reserva por WhatsApp</small><strong>+1 (XXX) XXX-XXXX</strong></span><Arrow /></a><a className="contact-item" href="https://www.instagram.com/soleandodr/"><span className="contact-icon">◎</span><span><small>Síguenos en Instagram</small><strong>@soleandodr</strong></span><Arrow /></a><a className="contact-item" href="#ubicacion"><span className="contact-icon">⌖</span><span><small>Encuéntranos en</small><strong>República Dominicana</strong></span><Arrow /></a></div></div></section>

      <footer><a className="brand" href="#inicio"><span className="brand-mark">S</span><span>soleando</span></a><p>Excursiones que se quedan contigo.</p><span>© 2026 Soleando</span></footer>
    </main>
  )
}

                 
