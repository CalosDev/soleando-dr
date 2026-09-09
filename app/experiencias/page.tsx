import { InformationalPage } from '@/components/site/informational-page'

export const metadata = { title: 'Experiencias', description: 'Descubre experiencias para complementar tu viaje con Soleando.' }
export default function ExperiencesPage() { return <InformationalPage title="Experiencias para disfrutar el destino." description="Desde días de playa hasta aventura y cultura local, te ayudamos a encontrar el plan que se siente como vacaciones." action={{ label: 'Consultar experiencias', href: '/contacto' }} /> }
