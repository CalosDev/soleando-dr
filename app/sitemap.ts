import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getExperiences, getCruises } from '@/features/catalog/repository'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, '')
  const [experiences, cruises] = await Promise.all([getExperiences(), getCruises()])

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hoteles`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experiencias`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cruceros`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nosotros`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politicas`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...experiences.map((item) => ({ url: `${baseUrl}/experiencias/${encodeURIComponent(item.slug)}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...cruises.map((item) => ({ url: `${baseUrl}/cruceros/${encodeURIComponent(item.id)}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ]
}
