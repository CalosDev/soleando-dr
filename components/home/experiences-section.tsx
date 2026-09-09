import Image from 'next/image'
import Link from 'next/link'

const experiences = [
  { title: 'Isla Saona', image: '/soleando-paradise.jpg' },
  { title: 'Aventura en buggy', image: '/soleando-waterfall.png' },
  { title: 'Día de catamarán', image: '/soleando-sunset.png' },
]

export function ExperiencesSection() {
  return <section className="home-section experiences-section" id="experiencias" aria-labelledby="experiences-title"><div className="section-intro"><p>El viaje también sucede fuera del hotel</p><h2 id="experiences-title">Experiencias para recordar.</h2></div><div className="experience-layout"><div className="experience-list">{experiences.map((experience, index) => <article key={experience.title}><span>0{index + 1}</span><h3>{experience.title}</h3><p>Tiempo bien aprovechado, con opciones que se adaptan a tu forma de viajar.</p></article>)}<Link className="text-cta" href="/experiencias">Ver experiencias <span aria-hidden="true">↗</span></Link></div><div className="experience-image"><Image src="/soleando-beach.png" alt="Personas disfrutando de un día de playa" fill sizes="(max-width: 900px) 100vw, 50vw" /></div></div></section>
}
