import { InformationalPage } from '@/components/site/informational-page'

export const metadata = { title: 'Nosotros', description: 'Conoce Soleando y nuestra forma de acompañarte a viajar.' }
export default function AboutPage() { return <InformationalPage title="Viajes que empiezan con una buena conversación." description="Soleando te ayuda a explorar hoteles, experiencias y escapadas con una atención cercana y clara." action={{ label: 'Hablar con Soleando', href: '/contacto' }} /> }
