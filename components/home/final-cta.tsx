import { siteConfig } from '@/config/site'

export function FinalCta() {
  return <section className="final-cta" id="contacto"><div><p>¿No sabes qué destino elegir?</p><h2>Cuéntanos qué viaje imaginas.</h2><span>Te ayudamos a planear una escapada, unas vacaciones en familia o ese descanso que estás buscando.</span></div><a className="site-button site-button-primary" href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">Hablar con Soleando</a></section>
}
