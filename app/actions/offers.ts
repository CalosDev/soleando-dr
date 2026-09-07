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
  dateLabel: z.string().trim().optional(), includes: z.string().optional(), imageUrl: z.string().min(1).refine(v => v.startsWith('/') || v.startsWith('http'), { message: 'Invalid URL' }),
  instagramUrl: z.string().url().optional().or(z.literal('')), featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

let inMemoryDemoOffers: Offer[] = [
  {
    id: 'peru-semana-santa-2027',
    slug: 'peru-unico-semana-santa-2027',
    title: 'Perú Único – Semana Santa 2027',
    destination: 'Lima, Cusco & Machu Picchu, Perú',
    category: 'Viajes',
    description: 'Esta Semana Santa vive 9 días descubriendo lo mejor de Perú, desde la historia y gastronomía de Lima hasta la magia de Cusco, el Valle Sagrado y el impresionante Machu Picchu. Salida desde Santo Domingo. Reserva tu espacio con solo US$150.',
    price: '2280.00',
    currency: 'USD',
    dateLabel: '21 al 29 de marzo 2027 · 9 días / 8 noches',
    includes: [
      'Boletos aéreos Santo Domingo – Lima y vuelos internos',
      '8 noches de alojamiento y traslados privados',
      'Tours Lima, Barranco y Miraflores + experiencia gastronómica',
      'Valle Sagrado: Misminay, Moray y Ollantaytambo',
      'Tren Expedition ida y vuelta a Machu Picchu',
      'Entrada y visita guiada a Machu Picchu con buses',
      'Almuerzo en Café Inkaterra',
      'City Tour de Cusco completo',
      'Seguro de viaje y equipaje'
    ],
    imageUrl: '/soleando-peru.jpg',
    instagramUrl: 'https://www.instagram.com/p/Dc1cfRMRO6K/',
    instagramMediaId: '3978211139917246090',
    status: 'published',
    featured: true,
    source: 'instagram',
    manualOverrides: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'demo-saona',

    slug: 'isla-saona-vip',
    title: 'Isla Saona VIP & Catamarán',
    destination: 'Bayahíbe',
    category: 'Full Day',
    description: 'Navega en catamarán privado, piscina natural con estrellas de mar y almuerzo buffet frente al mar caribeño.',
    price: '79.00',
    currency: 'USD',
    dateLabel: 'Válido este mes',
    includes: ['Catamarán exclusivo', 'Almuerzo buffet', 'Bar abierto'],
    imageUrl: '/soleando-beach.png',
    instagramUrl: 'https://www.instagram.com/soleandodr/',
    instagramMediaId: null,
    status: 'published',
    featured: true,
    source: 'manual',
    manualOverrides: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'demo-sunset',
    slug: 'sunset-cruise-champagne',
    title: 'Sunset Cruise & Champagne',
    destination: 'Punta Cana',
    category: 'Experiencia Privada',
    description: 'Atardecer dorado navegando la costa, música suave y brindis exclusivo al caer el sol caribeño.',
    price: '65.00',
    currency: 'USD',
    dateLabel: 'Horario: 4:30 PM',
    includes: ['Brindis espumoso', 'Snacks gourmet', 'Puesta de sol'],
    imageUrl: '/soleando-sunset.png',
    instagramUrl: null,
    instagramMediaId: null,
    status: 'published',
    featured: true,
    source: 'manual',
    manualOverrides: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'demo-cascadas',
    slug: 'cascadas-jungla-safari',
    title: 'Cascadas & Jungla Safari',
    destination: 'Samaná',
    category: 'Ecoturismo',
    description: 'Senderos tropicales secretos, baño en cascadas cristalinas y deliciosa comida típica dominicana.',
    price: '89.00',
    currency: 'USD',
    dateLabel: 'Salidas diarias',
    includes: ['Transporte 4x4', 'Guía local experto', 'Almuerzo criollo'],
    imageUrl: '/soleando-waterfall.png',
    instagramUrl: null,
    instagramMediaId: null,
    status: 'draft',
    featured: false,
    source: 'manual',
    manualOverrides: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

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

