'use server'

import { and, asc, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { catalogItems, type CatalogItem } from '@/lib/db/schema'

const catalogKindSchema = z.enum([
  'destination',
  'hotel',
  'tour',
  'excursion_national',
  'excursion_international',
  'cruise',
])

const catalogFormSchema = z.object({
  kind: catalogKindSchema,
  title: z.string().trim().min(2).max(140),
  slug: z.string().trim().max(160).optional(),
  destination: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  duration: z.string().trim().max(60).optional(),
  description: z.string().trim().min(10).max(2000),
  priceFrom: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().length(3).default('USD'),
  image: z.string().trim().refine((value) => value.startsWith('/') || /^https:\/\//.test(value), 'La imagen debe ser una ruta local o URL HTTPS.'),
  badge: z.string().trim().max(60).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
})

type CatalogFormValues = z.infer<typeof catalogFormSchema>

async function requireAdminAction(): Promise<void> {
  try {
    const session = await auth?.api.getSession({ headers: await headers() })
    if (session?.user && (session.user as { role?: string }).role === 'admin') return
  } catch {}

  throw new Error('Unauthorized')
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function toCatalogContent(values: CatalogFormValues, id: string, existingContent?: unknown): Record<string, unknown> {
  const slug = values.slug ? slugify(values.slug) : slugify(values.title)
  const existing = typeof existingContent === 'object' && existingContent !== null
    ? existingContent as Record<string, unknown>
    : {}
  const base = {
    ...existing,
    id,
    slug,
    title: values.title,
    description: values.description,
    destination: values.destination || 'Por confirmar',
    category: values.category || 'Experiencia',
    duration: values.duration || 'Por confirmar',
    priceFrom: values.priceFrom ?? 0,
    currency: values.currency.toUpperCase(),
    image: values.image,
    ...(values.badge ? { badge: values.badge } : {}),
  }

  // The first editor intentionally exposes only the common fields. Keep the
  // richer, type-specific fields already stored in the catalog intact.
  if (Object.keys(existing).length > 0) {
    if (values.kind === 'hotel' || values.kind === 'destination') return { ...base, name: values.title }
    return base
  }

  if (values.kind === 'cruise') {
    return {
      ...base,
      line: values.category || 'Naviera por confirmar',
      itinerary: values.destination || 'Itinerario por confirmar',
      departurePort: 'Por confirmar',
    }
  }

  if (values.kind === 'hotel') {
    return {
      ...base,
      name: values.title,
      destinationSlug: slugify(values.destination || 'por-confirmar'),
      stars: 0,
      rating: 0,
      reviewCount: 0,
      mealPlan: values.category || 'Por confirmar',
      amenities: [],
      isMock: false,
    }
  }

  if (values.kind === 'destination') {
    return {
      ...base,
      name: values.title,
      region: values.destination || 'Por confirmar',
      hotelCount: 0,
      isMock: false,
    }
  }

  return {
    ...base,
    priceRD: 0,
    gallery: [values.image],
    rating: 0,
    reviewCount: 0,
    difficulty: 'Fácil',
    groupType: 'Grupos reducidos',
    included: [],
    notIncluded: [],
    itinerary: [],
    recommendations: [],
  }
}

function formValues(formData: FormData): CatalogFormValues {
  return catalogFormSchema.parse({
    kind: formData.get('kind'),
    title: formData.get('title'),
    slug: formData.get('slug') || undefined,
    destination: formData.get('destination') || undefined,
    category: formData.get('category') || undefined,
    duration: formData.get('duration') || undefined,
    description: formData.get('description'),
    priceFrom: formData.get('priceFrom') || undefined,
    currency: formData.get('currency') || 'USD',
    image: formData.get('image'),
    badge: formData.get('badge') || undefined,
    status: formData.get('status') || 'draft',
    sortOrder: formData.get('sortOrder') || 0,
  })
}

function revalidateCatalog(): void {
  revalidatePath('/')
  revalidatePath('/destinos')
  revalidatePath('/experiencias')
  revalidatePath('/cruceros')
  revalidatePath('/hoteles')
  revalidatePath('/admin')
}

export async function getAdminCatalogItems(): Promise<CatalogItem[]> {
  await requireAdminAction()
  if (!db) return []

  return db.select().from(catalogItems).orderBy(asc(catalogItems.kind), asc(catalogItems.sortOrder), desc(catalogItems.updatedAt))
}

export async function getAdminCatalogItem(id: string): Promise<CatalogItem | null> {
  await requireAdminAction()
  if (!db) return null

  const [item] = await db.select().from(catalogItems).where(eq(catalogItems.id, id))
  return item ?? null
}

export async function createCatalogItem(formData: FormData): Promise<void> {
  await requireAdminAction()
  if (!db) throw new Error('El catálogo no está disponible.')

  const values = formValues(formData)
  const id = `catalog-${crypto.randomUUID()}`
  const content = toCatalogContent(values, id)

  await db.insert(catalogItems).values({
    id,
    kind: values.kind,
    slug: String(content.slug),
    content,
    status: values.status,
    sortOrder: values.sortOrder,
  })

  revalidateCatalog()
  redirect('/admin')
}

export async function updateCatalogItem(id: string, formData: FormData): Promise<void> {
  await requireAdminAction()
  if (!db) throw new Error('El catálogo no está disponible.')

  const values = formValues(formData)
  const [current] = await db.select({ content: catalogItems.content }).from(catalogItems).where(eq(catalogItems.id, id))
  if (!current) throw new Error('El contenido no existe.')
  const content = toCatalogContent(values, id, current.content)

  await db.update(catalogItems)
    .set({ kind: values.kind, slug: String(content.slug), content, status: values.status, sortOrder: values.sortOrder, updatedAt: new Date() })
    .where(eq(catalogItems.id, id))

  revalidateCatalog()
  redirect('/admin')
}

export async function archiveCatalogItem(id: string): Promise<void> {
  await requireAdminAction()
  if (!db) throw new Error('El catálogo no está disponible.')

  await db.update(catalogItems).set({ status: 'archived', updatedAt: new Date() }).where(eq(catalogItems.id, id))
  revalidateCatalog()
}

export async function deleteCatalogItem(id: string): Promise<void> {
  await requireAdminAction()
  if (!db) throw new Error('El catálogo no está disponible.')

  await db.delete(catalogItems).where(and(eq(catalogItems.id, id)))
  revalidateCatalog()
}
