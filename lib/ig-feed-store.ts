import fs from 'fs'
import path from 'path'
import type { IgPost } from '@/app/api/instagram-reels/route'
import { db, requireDatabase } from '@/lib/db'
import { instagramPosts } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

export type ManagedIgPost = IgPost & {
  likesCount?: number
  location?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'ig-posts.json')

export const DEFAULT_IG_POSTS: ManagedIgPost[] = [
  {
    "id": "DXXpTtQj9ix",
    "media_type": "VIDEO",
    "media_url": "/ig/ig-DXXpTtQj9ix.jpg",
    "thumbnail_url": "/ig/ig-DXXpTtQj9ix.jpg",
    "permalink": "https://www.instagram.com/reel/DXXpTtQj9ix/",
    "timestamp": "2026-03-06T18:00:00.000Z",
    "caption": "La mejor opción para el mes de octubre ✨ Royalton Splash Punta Cana 🔥",
    "likesCount": 1530,
    "location": "Punta Cana, Rep. Dom."
  },
  {
    id: 'Dc8wQL-xd8-',
    media_type: 'VIDEO',
    media_url: '/ig/ig-Dc8wQL-xd8-.jpg',
    thumbnail_url: '/ig/ig-Dc8wQL-xd8-.jpg',
    permalink: 'https://www.instagram.com/reel/Dc8wQL-xd8-/',
    timestamp: '2026-03-05T18:00:00.000Z',
    caption: '🌴✨ EL RESORT MÁS VIRAL DEL MOMENTO ✨🌴 Descubre Lopesan Caoba Lagoon 🤩',
    likesCount: 1840,
    location: 'Bávaro, Punta Cana',
  },
  {
    id: 'DczkM8_h0VA',
    media_type: 'VIDEO',
    media_url: '/ig/ig-DczkM8_h0VA.jpg',
    thumbnail_url: '/ig/ig-DczkM8_h0VA.jpg',
    permalink: 'https://www.instagram.com/reel/DczkM8_h0VA/',
    timestamp: '2026-03-03T15:00:00.000Z',
    caption: 'SOTTO TERRA 🍝 Restaurante Italiano del Resort Lopesan Caoba Lagoon ✨🧡',
    likesCount: 1420,
    location: 'Punta Cana, Rep. Dom.',
  },
  {
    id: 'Dcyhw7mxNnF',
    media_type: 'VIDEO',
    media_url: '/ig/ig-Dcyhw7mxNnF.jpg',
    thumbnail_url: '/ig/ig-Dcyhw7mxNnF.jpg',
    permalink: 'https://www.instagram.com/reel/Dcyhw7mxNnF/',
    timestamp: '2026-03-01T12:00:00.000Z',
    caption: 'Lopesan Caoba Lagoon 🌊 - Room tour de su habitación Standard 🔥',
    likesCount: 1290,
    location: 'Punta Cana, Rep. Dom.',
  },
  {
    id: 'DM0ilWduUhR',
    media_type: 'IMAGE',
    media_url: '/ig/ig-DM0ilWduUhR.jpg',
    thumbnail_url: '/ig/ig-DM0ilWduUhR.jpg',
    permalink: 'https://www.instagram.com/p/DM0ilWduUhR/',
    timestamp: '2026-02-25T10:00:00.000Z',
    caption: 'Equipo de ventas de Soleando ☀️ Detrás de cada reserva hay un equipo apasionado 🧡🌊',
    likesCount: 1980,
    location: 'Santo Domingo, Rep. Dom.',
  },
  {
    id: 'Dc1cfRMRO6K',
    media_type: 'IMAGE',
    media_url: '/ig/ig-Dc1cfRMRO6K.jpg',
    thumbnail_url: '/ig/ig-Dc1cfRMRO6K.jpg',
    permalink: 'https://www.instagram.com/p/Dc1cfRMRO6K/',
    timestamp: '2026-02-15T09:00:00.000Z',
    caption: 'Perú Único – Semana Santa 2027. Lima, Cusco & Machu Picchu 🇵🇪✈️',
    likesCount: 2150,
    location: 'Machu Picchu, Perú',
  },
]

function readFallbackPosts(): ManagedIgPost[] {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return DEFAULT_IG_POSTS
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as ManagedIgPost[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_IG_POSTS
  } catch {
    return DEFAULT_IG_POSTS
  }
}

export async function readIgPosts(): Promise<ManagedIgPost[]> {
  if (!db) return readFallbackPosts()

  try {
    const rows = await db.select().from(instagramPosts).orderBy(asc(instagramPosts.sortOrder))
    if (rows.length === 0) return readFallbackPosts()

    return rows.map((row) => ({
      id: row.id,
      media_type: row.mediaType as ManagedIgPost['media_type'],
      media_url: row.mediaUrl,
      thumbnail_url: row.thumbnailUrl ?? undefined,
      permalink: row.permalink,
      timestamp: row.publishedAt.toISOString(),
      caption: row.caption ?? undefined,
      likesCount: row.likesCount ?? undefined,
      location: row.location ?? undefined,
    }))
  } catch (err) {
    console.error('Failed to read IG posts from the database:', err)
    return readFallbackPosts()
  }
}

export async function writeIgPosts(posts: ManagedIgPost[]): Promise<void> {
  const database = requireDatabase()
  await database.transaction(async (transaction) => {
    await transaction.delete(instagramPosts)
    if (posts.length === 0) return

    await transaction.insert(instagramPosts).values(posts.map((post, sortOrder) => ({
      id: post.id,
      mediaType: post.media_type,
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url ?? null,
      permalink: post.permalink,
      publishedAt: new Date(post.timestamp),
      caption: post.caption ?? null,
      likesCount: post.likesCount ?? null,
      location: post.location ?? null,
      sortOrder,
      updatedAt: new Date(),
    })))
  })
}
