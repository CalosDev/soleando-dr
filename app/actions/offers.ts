'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { offers } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const offerSchema = z.object({
  title: z.string().trim().min(2), destination: z.string().trim().min(2), category: z.string().trim().min(2),
  description: z.string().trim().min(10), price: z.string().trim().optional(), currency: z.string().default('USD'),
  dateLabel: z.string().trim().optional(), includes: z.string().optional(), imageUrl: z.string().url(),
  instagramUrl: z.string().url().optional().or(z.literal('')), featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
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

export async function getPublishedOffers() { return db.select().from(offers).where(eq(offers.status, 'published')).orderBy(desc(offers.featured), desc(offers.createdAt)) }
export async function getAdminOffers() { await requireAdmin(); return db.select().from(offers).orderBy(desc(offers.updatedAt)) }
export async function getAdminOffer(id: string) { await requireAdmin(); const result = await db.select().from(offers).where(eq(offers.id, id)); return result[0] }
export async function createOffer(input: unknown) { await requireAdmin(); const data = offerSchema.parse(input); const id = crypto.randomUUID(); await db.insert(offers).values({ ...toValues(data), id, slug: `${slugify(data.title)}-${id.slice(0, 6)}`, source: 'manual', createdAt: new Date() }); revalidatePath('/'); revalidatePath('/ofertas'); revalidatePath('/admin'); return { ok: true } }
export async function updateOffer(id: string, input: unknown) { await requireAdmin(); const data = offerSchema.parse(input); await db.update(offers).set(toValues(data)).where(eq(offers.id, id)); revalidatePath('/'); revalidatePath('/ofertas'); revalidatePath('/admin'); revalidatePath(`/admin/ofertas/${id}/editar`); return { ok: true } }
export async function archiveOffer(id: string) { await requireAdmin(); await db.update(offers).set({ status: 'archived', updatedAt: new Date() }).where(eq(offers.id, id)); revalidatePath('/'); revalidatePath('/ofertas'); revalidatePath('/admin'); return { ok: true } }
export async function deleteOffer(id: string) { await requireAdmin(); await db.delete(offers).where(eq(offers.id, id)); revalidatePath('/'); revalidatePath('/ofertas'); revalidatePath('/admin'); return { ok: true } }
