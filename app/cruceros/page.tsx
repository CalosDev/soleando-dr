import { InformationalPage } from '@/components/site/informational-page'

export const metadata = { title: 'Cruceros', description: 'Consulta opciones de cruceros con Soleando.' }
export default function CruisesPage() { return <InformationalPage title="Un viaje que cambia de vista cada día." description="Si quieres navegar el Caribe, cuéntanos el tipo de viaje, tus fechas aproximadas y quiénes te acompañan." action={{ label: 'Consultar cruceros', href: '/contacto' }} /> }
