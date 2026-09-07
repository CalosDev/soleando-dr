'use server'

import { revalidatePath } from 'next/cache'
import { readIgPosts, writeIgPosts, type ManagedIgPost } from '@/lib/ig-feed-store'

function extractPostId(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_\-]+)/)
  return match ? match[1] : null
}

function guessLocationFromText(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('machu picchu') || lower.includes('cusco') || lower.includes('perú') || lower.includes('peru')) {
    return 'Machu Picchu, Perú'
  }
  if (lower.includes('brasil') || lower.includes('rio de janeiro') || lower.includes('diadema')) {
    return 'Río de Janeiro, Brasil'
  }
  if (lower.includes('lopesan') || lower.includes('caoba') || lower.includes('bavaro') || lower.includes('bávaro')) {
    return 'Bávaro, Punta Cana'
  }
  if (lower.includes('punta cana') || lower.includes('royalton') || lower.includes('splash')) {
    return 'Punta Cana, Rep. Dom.'
  }
  if (lower.includes('samaná') || lower.includes('samana') || lower.includes('limón') || lower.includes('limon')) {
    return 'Samaná, Rep. Dom.'
  }
  if (lower.includes('saona') || lower.includes('catamarán') || lower.includes('catamaran')) {
    return 'Isla Saona, Rep. Dom.'
  }
  if (lower.includes('santo domingo') || lower.includes('equipo') || lower.includes('ventas')) {
    return 'Santo Domingo, Rep. Dom.'
  }
  return 'República Dominicana'
}

/**
 * Cleans up raw Instagram captions, removes hashtags, phone numbers, long paragraphs,
 * and extracts a clean, concise headline (max ~85 chars).
 */
function cleanAndShortenCaption(raw: string): string {
  if (!raw) return ''

  // Split into lines
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'))

  // Filter out contact/phone/reservation lines
  const cleanLines = lines.filter((l) => {
    const low = l.toLowerCase()
    return (
      !low.includes('reservaciones') &&
      !low.includes('reserva tu') &&
      !low.includes('comenta la palabra') &&
      !low.includes('habitaciones disponibles') &&
      !low.includes('📞') &&
      !low.includes('📲') &&
      !low.includes('+1 (') &&
      !low.includes('whatsapp') &&
      !low.includes('dm')
    )
  })

  let headline = cleanLines.slice(0, 2).join(' – ')
  if (!headline) headline = lines[0] || 'Publicación oficial en Instagram'

  // Remove hashtags
  headline = headline.replace(/#\w+/g, '').replace(/\s+/g, ' ').trim()

  if (headline.length > 90) {
    headline = headline.slice(0, 87).trim() + '...'
  }

  return headline
}

export async function getIgPostsServerAction(): Promise<ManagedIgPost[]> {
  return readIgPosts()
}

/**
 * Fetches and autofills Instagram post details from a public URL.
 * Downloads the thumbnail locally so it never expires and cleans the caption.
 */
export async function fetchIgPostPreview(url: string): Promise<{
  ok: boolean
  error?: string
  data?: ManagedIgPost
}> {
  try {
    const cleanUrl = url.trim()
    if (!cleanUrl.includes('instagram.com/')) {
      return { ok: false, error: 'Introduce un enlace válido de Instagram (ej: https://www.instagram.com/reel/... o /p/...)' }
    }

    const postId = extractPostId(cleanUrl)
    if (!postId) {
      return { ok: false, error: 'No se pudo identificar el código de la publicación en la URL.' }
    }

    const isVideo = cleanUrl.includes('/reel/') || cleanUrl.includes('/reels/')
    const canonicalUrl = `https://www.instagram.com/p/${postId}/`

    let imageUrl = '/soleando-hero.png'
    let fetchedCaption = ''

    // Query Instagram oEmbed API
    try {
      const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(canonicalUrl)}`
      const oembedRes = await fetch(oembedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      })

      if (oembedRes.ok) {
        const oembed = (await oembedRes.json()) as { thumbnail_url?: string; title?: string }
        if (oembed.title) fetchedCaption = oembed.title

        if (oembed.thumbnail_url) {
          // Download locally to /public/ig/
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
          const downloadRes = await fetch(`${baseUrl}/api/ig-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: oembed.thumbnail_url, postId }),
          })

          if (downloadRes.ok) {
            const { localPath } = (await downloadRes.json()) as { localPath: string }
            imageUrl = localPath
          } else {
            imageUrl = oembed.thumbnail_url
          }
        }
      }
    } catch (e) {
      console.warn('oEmbed fetch error:', e)
    }

    const location = guessLocationFromText(fetchedCaption)
    const cleanCaption = cleanAndShortenCaption(fetchedCaption)
    const randomLikes = Math.floor(Math.random() * 1200) + 900

    const postData: ManagedIgPost = {
      id: postId,
      media_type: isVideo ? 'VIDEO' : 'IMAGE',
      media_url: imageUrl,
      thumbnail_url: imageUrl,
      permalink: cleanUrl,
      timestamp: new Date().toISOString(),
      caption: cleanCaption || 'Publicación en Instagram @soleandodr',
      likesCount: randomLikes,
      location,
    }

    return { ok: true, data: postData }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al consultar Instagram'
    return { ok: false, error: msg }
  }
}

/**
 * Saves or updates a managed Instagram post to the front of the carousel.
 */
export async function saveIgPostAction(post: ManagedIgPost): Promise<{ ok: boolean; error?: string }> {
  try {
    const cleanedPost: ManagedIgPost = {
      ...post,
      caption: cleanAndShortenCaption(post.caption || ''),
    }

    const currentPosts = readIgPosts()
    // Prepend new post, remove any existing duplicate by ID
    const updated = [cleanedPost, ...currentPosts.filter((p) => p.id !== post.id)]
    writeIgPosts(updated)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/instagram')
    revalidatePath('/api/instagram-reels')

    return { ok: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al guardar la publicación'
    return { ok: false, error: msg }
  }
}

/**
 * Moves an IG post up or down in the ordering.
 */
export async function moveIgPostAction(id: string, direction: 'up' | 'down'): Promise<{ ok: boolean }> {
  const posts = readIgPosts()
  const index = posts.findIndex((p) => p.id === id)
  if (index === -1) return { ok: false }

  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= posts.length) return { ok: true }

  const updated = [...posts]
  const [removed] = updated.splice(index, 1)
  updated.splice(newIndex, 0, removed)

  writeIgPosts(updated)
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/instagram')
  revalidatePath('/api/instagram-reels')

  return { ok: true }
}

export async function deleteIgPostAction(id: string): Promise<{ ok: boolean }> {
  const currentPosts = readIgPosts()
  const updated = currentPosts.filter((p) => p.id !== id)
  writeIgPosts(updated)

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/instagram')
  revalidatePath('/api/instagram-reels')

  return { ok: true }
}
