'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { offers } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const offerSchema = z.object({ title: z.string().min(2), destination: z.string().min(2), category: z.string().min(2), description: z.string().min(10), price: z.string().optional(), currency: z.string().default('USD'), dateLabel: z.string().optional(), includes: z.string().optional(), imageUrl: z.string().url(), instagramUrl: z.string().url().optional().or(z.literal('')), featured: z.boolean().default(false), status: z.enum(['draft', 'published', 'archived']).default('draft') })

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}
function slugify(value: string) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
export async function getPublishedOffers() { return db.select().from(offers).where(eq(offers.status, 'published')).orderBy(desc(offers.featured), desc(offers.createdAt)) }
export async function getAdminOffers() { await requireAdmin(); return db.select().from(offers).orderBy(desc(offers.updatedAt)) }
export async function createOffer(input: unknown) { await requireAdmin(); const data = offerSchema.parse(input); const id = crypto.randomUUID(); await db.insert(offers).values({ id, slug: `${slugify(data.title)}-${id.slice(0, 6)}`, title: data.title, destination: data.destination, category: data.category, description: data.description, price: data.price || null, currency: data.currency, dateLabel: data.dateLabel || null, includes: data.includes?.split(',').map((item) => item.trim()).filter(Boolean) || [], imageUrl: data.imageUrl, instagramUrl: data.instagramUrl || null, featured: data.featured, status: data.status, source: 'manual', manualOverrides: Object.keys(data) }); revalidatePath('/'); revalidatePath('/ofertas'); revalidatePath('/admin'); return { ok: true } }
export async function updateOffer(id: string, input: unknown) { await requireAdmin(); const data = offerSchema.parse(input); await db.update(offers).set({ title: data.title, destination: data.destination, category: data.category, description: data.description, price: data.price || null, currency: data.currency, dateLabel: data.dateLabel || null, includes: data.includes?.split(',').map((item) => item.trim()).filter(Boolean) || [], imageUrl: data.imageUrl, instagramUrl: data.instagramUrl || null, featured: data.featured, status: data.status, updatedAt: new Date(), manualOverrides: Object.keys(data) }).where(eq(offers.id, id)); revalidatePath('/'); revalidatePath('/ofertas'); revalidatePath('/admin'); return { ok: true } }
export async function archiveOffer(id: string) { await requireAdmin(); await db.update(offers).set({ status: 'archived', updatedAt: new Date() }).where(eq(offers.id, id)); revalidatePath('/'); revalidatePath('/ofertas'); revalidatePath('/admin'); return { ok: true } }
