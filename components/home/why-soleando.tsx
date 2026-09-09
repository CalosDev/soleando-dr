const reasons = [
  ['Escuchamos primero', 'Cada viaje empieza entendiendo qué te gustaría vivir.'],
  ['Acompañamiento cercano', 'Estamos para ayudarte antes y durante tu viaje.'],
  ['Opciones con criterio', 'Hoteles y experiencias pensados para distintos ritmos y viajeros.'],
  ['Un contacto claro', 'Cuando lo necesites, puedes hablar con una persona de nuestro equipo.'],
]

export function WhySoleando() {
  return <section className="home-section why-section" aria-labelledby="why-title"><div className="section-intro"><p>Viajar con calma</p><h2 id="why-title">¿Por qué Soleando?</h2></div><div className="why-grid">{reasons.map(([title, description]) => <article key={title}><span aria-hidden="true">✦</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
}
