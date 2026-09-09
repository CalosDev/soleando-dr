export interface NavItem {
  title: string
  href: string
}

export const siteConfig = {
  name: 'Soleando DR',
  shortName: 'Soleando',
  slogan: 'Tu próximo viaje empieza aquí',
  description: 'Encuentra hoteles, destinos y experiencias para tu próximo viaje en República Dominicana y el Caribe con Soleando.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://soleando.com.do',
  whatsappUrl: 'https://api.whatsapp.com/message/D3DXUHVK575TH1?autoload=1&app_absent=0',
  whatsappNumber: '+1 (809) 000-0000',
  instagramUrl: 'https://www.instagram.com/soleandodr/',
  instagramHandle: '@soleandodr',
  location: 'Santo Domingo, República Dominicana',
  mainNav: [
    { title: 'Inicio', href: '/' },
    { title: 'Hoteles', href: '/hoteles' },
    { title: 'Experiencias', href: '/experiencias' },
    { title: 'Cruceros', href: '/cruceros' },
    { title: 'Nosotros', href: '/nosotros' },
    { title: 'Contacto', href: '/contacto' },
  ] as NavItem[],
}
