'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { offers, type Offer } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers, cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const offerSchema = z.object({
  title: z.string().trim().min(2), destination: z.string().trim().min(2), category: z.string().trim().min(2),
  description: z.string().trim().min(10), price: z.string().trim().optional(), currency: z.string().default('USD'),
  dateLabel: z.string().trim().optional(), includes: z.string().optional(), imageUrl: z.string().min(1).refine(v => v.startsWith('/') || v.startsWith('http') || v.startsWith('data:image/'), { message: 'Invalid URL' }),
  instagramUrl: z.string().url().optional().or(z.literal('')), featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

let inMemoryDemoOffers: Offer[] = []

async function requireAdmin() {
  const cookieStore = await cookies()
  if (cookieStore.get('soleando_demo_session')?.value === 'true') {
    return { id: 'demo-admin-id', name: 'Administrador Demo', email: 'admin@soleando.com' }
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user) return session.user
  } catch {
    // DB error
  }

  throw new Error('Unauthorized')
}

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function toValues(data: z.infer<typeof offerSchema>) {
  return {
    title: data.title, destination: data.destination, category: data.category, description: data.description,
    price: data.price || null, currency: data.currency, dateLabel: data.dateLabel || null,
    includes: data.includes?.split(',').map((item) => item.trim()).filter(Boolean) || [], imageUrl: data.imageUrl,
    instagramUrl: data.instagramUrl || null, featured: data.featured, status: data.status,
    manualOverrides: Object.keys(data), updatedAt: new Date(),
  }
}

export async function getPublishedOffers(): Promise<Offer[]> {
  try {
    const dbRes = await db.select().from(offers).where(eq(offers.status, 'published')).orderBy(desc(offers.featured), desc(offers.createdAt))
    if (dbRes && dbRes.length > 0) return dbRes
  } catch {}
  return inMemoryDemoOffers.filter((o) => o.status === 'published')
}

export async function getAdminOffers(): Promise<Offer[]> {
  await requireAdmin()
  try {
    const dbRes = await db.select().from(offers).orderBy(desc(offers.updatedAt))
    if (dbRes && dbRes.length > 0) return dbRes
  } catch {}
  return inMemoryDemoOffers
}

export async function getAdminOffer(id: string): Promise<Offer | undefined> {
  await requireAdmin()
  try {
    const result = await db.select().from(offers).where(eq(offers.id, id))
    if (result[0]) return result[0]
  } catch {}
  return inMemoryDemoOffers.find((o) => o.id === id)
}

export async function createOffer(input: unknown) {
  await requireAdmin()
  const data = offerSchema.parse(input)
  const id = crypto.randomUUID()
  const newOffer: Offer = {
    ...toValues(data),
    id,
    slug: `${slugify(data.title)}-${id.slice(0, 6)}`,
    source: 'manual',
    instagramMediaId: null,
    createdAt: new Date(),
  }

  try {
    await db.insert(offers).values(newOffer)
  } catch {
    inMemoryDemoOffers = [newOffer, ...inMemoryDemoOffers]
  }

  revalidatePath('/')
  revalidatePath('/ofertas')
  revalidatePath('/admin')
  return { ok: true }
}

export async function updateOffer(id: string, input: unknown) {
  await requireAdmin()
  const data = offerSchema.parse(input)
  const updatedValues = toValues(data)

  try {
    await db.update(offers).set(updatedValues).where(eq(offers.id, id))
  } catch {
    inMemoryDemoOffers = inMemoryDemoOffers.map((o) => (o.id === id ? { ...o, ...updatedValues } : o))
  }

  revalidatePath('/')
  revalidatePath('/ofertas')
  revalidatePath('/admin')
  revalidatePath(`/admin/ofertas/${id}/editar`)
  return { ok: true }
}

export async function archiveOffer(id: string) {
  await requireAdmin()
  try {
    await db.update(offers).set({ status: 'archived', updatedAt: new Date() }).where(eq(offers.id, id))
  } catch {
    inMemoryDemoOffers = inMemoryDemoOffers.map((o) => (o.id === id ? { ...o, status: 'archived', updatedAt: new Date() } : o))
  }

  revalidatePath('/')
  revalidatePath('/ofertas')
  revalidatePath('/admin')
  return { ok: true }
}

export async function deleteOffer(id: string) {
  await requireAdmin()
  try {
    await db.delete(offers).where(eq(offers.id, id))
  } catch {
    inMemoryDemoOffers = inMemoryDemoOffers.filter((o) => o.id !== id)
  }

  revalidatePath('/')
  revalidatePath('/ofertas')
  revalidatePath('/admin')
  return { ok: true }
}

