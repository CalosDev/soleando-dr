'use server'

import { requireAdmin } from '@/lib/admin-auth'
import { db, requireDatabase } from '@/lib/db'
import { offers, type Offer } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const offerSchema = z.object({
  title: z.string().trim().min(2), destination: z.string().trim().min(2), category: z.string().trim().min(2),
  description: z.string().trim().min(10), price: z.string().trim().optional(), currency: z.string().default('USD'),
  dateLabel: z.string().trim().optional(), includes: z.string().optional(), imageUrl: z.string().min(1).refine(v => v.startsWith('/') || v.startsWith('http') || v.startsWith('data:image/'), { message: 'Invalid URL' }),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function toValues(data: z.infer<typeof offerSchema>) {
  return {
    title: data.title, destination: data.destination, category: data.category, description: data.description,
    price: data.price || null, currency: data.currency, dateLabel: data.dateLabel || null,
    includes: data.includes?.split(',').map((item) => item.trim()).filter(Boolean) || [], imageUrl: data.imageUrl,
    featured: data.featured, status: data.status, updatedAt: new Date(),
  }
}

export async function getPublishedOffers(): Promise<Offer[]> {
  if (!db) return []

  try {
    const dbRes = await db.select().from(offers).where(eq(offers.status, 'published')).orderBy(desc(offers.featured), desc(offers.createdAt))
    return dbRes
  } catch (error) {
    console.error('[Offers] Could not load published offers:', error)
    return []
  }
}

export async function getAdminOffers(): Promise<Offer[]> {
  await requireAdmin()
  return requireDatabase().select().from(offers).orderBy(desc(offers.updatedAt))
}

export async function getAdminOffer(id: string): Promise<Offer | undefined> {
  await requireAdmin()
  const result = await requireDatabase().select().from(offers).where(eq(offers.id, id))
  return result[0]
}

export async function createOffer(input: unknown) {
  await requireAdmin()
  const data = offerSchema.parse(input)
  const id = crypto.randomUUID()
  const newOffer: Offer = {
    ...toValues(data),
    id,
    slug: `${slugify(data.title)}-${id.slice(0, 6)}`,
    createdAt: new Date(),
  }

  await requireDatabase().insert(offers).values(newOffer)

  revalidatePath('/')
  revalidatePath('/ofertas')
  revalidatePath('/admin')
  return { ok: true }
}

export async function updateOffer(id: string, input: unknown) {
  await requireAdmin()
  const data = offerSchema.parse(input)
  const updatedValues = toValues(data)

  await requireDatabase().update(offers).set(updatedValues).where(eq(offers.id, id))

  revalidatePath('/')
  revalidatePath('/ofertas')
  revalidatePath('/admin')
  revalidatePath(`/admin/ofertas/${id}/editar`)
  return { ok: true }
}

export async function archiveOffer(id: string) {
  await requireAdmin()
  await requireDatabase().update(offers).set({ status: 'archived', updatedAt: new Date() }).where(eq(offers.id, id))

  revalidatePath('/')
  revalidatePath('/ofertas')
  revalidatePath('/admin')
  return { ok: true }
}

export async function deleteOffer(id: string) {
  await requireAdmin()
  await requireDatabase().delete(offers).where(eq(offers.id, id))

  revalidatePath('/')
  revalidatePath('/ofertas')
  revalidatePath('/admin')
  return { ok: true }
}

