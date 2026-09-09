import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/cuenta/',
          '/api/',
          '/login',
          '/registro',
          '/verificar-email',
          '/email-verificado',
          '/recuperar-contrasena',
          '/restablecer-contrasena',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
