import { z } from 'zod'

export type CatalogFormState = { error: string; fields?: Record<string, string> } | null

const optionalText = (max: number) => z.string().trim().max(max).optional()
export const catalogImageSchema = z.string().trim().max(2048).refine((value) => {
  if (/^\/(?!\/)[^\\?#]+\.(?:jpe?g|png|webp|avif)$/i.test(value)) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || (url.protocol === 'http:' && url.hostname === '127.0.0.1')
  } catch { return false }
}, 'Usa una imagen local o una URL HTTPS de Supabase Storage.')

function lines(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
}

const list = z.string().max(25000).transform(lines).pipe(z.array(z.string().max(500)).max(50)).optional()
const gallery = z.string().max(22000).transform(lines).pipe(z.array(catalogImageSchema).max(10)).optional()
const itinerary = z.string().max(25000).transform((value, context) => {
  return lines(value).map((line) => {
    const [step, title, ...description] = line.split('|').map((part) => part.trim())
    if (!step || !title || !description.join('|').trim()) {
      context.addIssue({ code: 'custom', message: 'Cada etapa requiere horario o día | título | descripción.' })
    }
    return { step, title, description: description.join('|').trim() }
  })
}).pipe(z.array(z.object({ step: z.string().max(80), title: z.string().max(140), description: z.string().max(2000) })).max(30)).optional()

export const catalogFormSchema = z.object({
  kind: z.enum(['tour', 'excursion_national', 'excursion_international', 'cruise']),
  title: z.string().trim().min(2).max(140),
  slug: optionalText(160),
  destination: optionalText(100),
  category: optionalText(100),
  duration: optionalText(60),
  description: z.string().trim().min(10).max(2000),
  priceFrom: z.coerce.number().finite().nonnegative().optional(),
  currency: z.string().trim().regex(/^[a-zA-Z]{3}$/, 'La moneda debe tener tres letras.').default('USD'),
  image: catalogImageSchema,
  badge: optionalText(60),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
  gallery,
  included: list,
  notIncluded: list,
  recommendations: list,
  experienceItinerary: itinerary,
  cruiseItinerary: optionalText(2000),
  departures: optionalText(500),
  line: optionalText(100),
  departurePort: optionalText(100),
  difficulty: optionalText(80),
  groupType: optionalText(100),
  priceRD: z.coerce.number().finite().nonnegative().optional(),
})

const publicBaseSchema = z.object({
  id: z.string().min(1), title: z.string().min(1), description: z.string(),
  duration: z.string().default('Por confirmar'), image: catalogImageSchema,
  priceFrom: z.number().finite().nonnegative().default(0), currency: z.string().default('USD'),
  badge: z.string().optional(), departures: z.string().optional(),
})
const stringList = z.array(z.string()).default([])
export const experienceContentSchema = publicBaseSchema.extend({
  slug: z.string().min(1), destination: z.string().default('Por confirmar'),
  category: z.string().default('Experiencia'), gallery: z.array(catalogImageSchema).default([]),
  priceRD: z.number().finite().nonnegative().default(0), rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().nonnegative().default(0), difficulty: z.string().default(''), groupType: z.string().default(''),
  included: stringList, notIncluded: stringList, recommendations: stringList,
  itinerary: z.array(z.object({ step: z.string(), title: z.string(), description: z.string() })).default([]),
})
export const cruiseContentSchema = publicBaseSchema.extend({
  line: z.string().default('Por confirmar'), itinerary: z.string().default('Por confirmar'),
  departurePort: z.string().default('Por confirmar'), gallery: z.array(catalogImageSchema).default([]),
  included: stringList, notIncluded: stringList, recommendations: stringList,
})

export function parseCatalogForm(form: FormData) {
  const fields: Record<string, unknown> = {}
  for (const key of Object.keys(catalogFormSchema.shape)) {
    if (form.has(key)) fields[key] = form.get(key)
  }
  for (const key of ['priceFrom', 'slug']) {
    if (fields[key] === '') fields[key] = undefined
  }
  if (fields.priceRD === '') fields.priceRD = 0
  return catalogFormSchema.safeParse(fields)
}

export function buildCatalogContent(values: z.infer<typeof catalogFormSchema>, id: string, existingContent?: unknown): Record<string, unknown> {
  const existing = typeof existingContent === 'object' && existingContent !== null ? existingContent as Record<string, unknown> : {}
  const slug = (values.slug || values.title).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const base: Record<string, unknown> = {
    ...existing, id, slug, title: values.title, description: values.description,
    destination: values.destination || 'Por confirmar', category: values.category || 'Experiencia',
    duration: values.duration || 'Por confirmar', priceFrom: values.priceFrom ?? 0,
    currency: values.currency.toUpperCase(), image: values.image,
  }
  if (values.badge !== undefined) base.badge = values.badge || undefined
  for (const key of ['gallery', 'included', 'notIncluded', 'recommendations', 'departures'] as const) {
    if (values[key] !== undefined) base[key] = values[key]
  }
  if (values.kind === 'cruise') {
    base.line = values.line ?? existing.line ?? values.category ?? 'Por confirmar'
    base.departurePort = values.departurePort ?? existing.departurePort ?? 'Por confirmar'
    base.itinerary = values.cruiseItinerary !== undefined
      ? lines(values.cruiseItinerary).join(' · ')
      : typeof existing.itinerary === 'string' ? existing.itinerary : values.destination || 'Por confirmar'
  } else {
    base.priceRD = values.priceRD ?? existing.priceRD ?? 0
    base.gallery ??= []
    base.rating = typeof existing.rating === 'number' ? existing.rating : 0
    base.reviewCount = typeof existing.reviewCount === 'number' ? existing.reviewCount : 0
    base.difficulty = values.difficulty ?? existing.difficulty ?? ''
    base.groupType = values.groupType ?? existing.groupType ?? ''
    base.included ??= []
    base.notIncluded ??= []
    base.recommendations ??= []
    base.itinerary = values.experienceItinerary ?? (Array.isArray(existing.itinerary) ? existing.itinerary : [])
  }
  return base
}
