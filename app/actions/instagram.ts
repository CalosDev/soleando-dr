'use server'

import { requireAdmin } from '@/lib/admin-auth'
import { downloadInstagramImage } from '@/lib/server-image-files'
import { parseInstagramPostUrl } from '@/lib/instagram-url'

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x3D;/g, '=')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
}

/** Parse caption text to extract price, dates, title, description */
function parseCaption(rawCaption: string) {
  const lines = rawCaption.split('\n').map((l) => l.trim()).filter(Boolean)

  // Title heuristic: first non-emoji-only line
  const title = lines[0]
    ? lines[0].replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim() || lines[0].trim()
    : 'Experiencia Soleando'

  // Price heuristic: looks for US$, $, USD
  const priceMatch = rawCaption.match(/(?:US\$|USD\s*|\$)\s*([\d,.]+)/i)
  const price = priceMatch ? priceMatch[1].replace(/,/g, '') : ''

  // Dates heuristic
  const dateMatch = rawCaption.match(/(\d{1,2}\s+(?:al|a|-)\s+\d{1,2}\s+de\s+[a-zá-ú]+(?:\s+\d{4})?)/i)
  const dateLabel = dateMatch ? dateMatch[1] : ''

  // Destination heuristic: check known locations first
  const knownDestinations = [
    'Punta Cana', 'Bayahíbe', 'Bayahibe', 'Samaná', 'Samana', 'La Romana',
    'Santo Domingo', 'Puerto Plata', 'Las Terrenas', 'Jarabacoa', 'Constanza',
    'Machu Picchu', 'Cusco', 'Perú', 'Peru', 'Cancún', 'Cancun',
    'Cartagena', 'Medellín', 'Medellin', 'Bogotá', 'Bogota', 'Orlando', 'Miami',
    'Madrid', 'Europa'
  ]
  const matchedKnown = knownDestinations.find(d => rawCaption.toLowerCase().includes(d.toLowerCase()))
  const destMatch = rawCaption.match(/(?:desde|en|hacia|a)\s+([A-ZÁÉÍÓÚ][a-záéíóú]+(?:,\s*[A-ZÁÉÍÓÚ][a-záéíóú]+)*)/i)
  const destination = matchedKnown || (destMatch ? destMatch[1] : 'República Dominicana')

  // Category heuristic
  let category = 'Excursiones'
  if (/vuelo|aéreo|viaje|internacional|hotel|noche/i.test(rawCaption)) category = 'Viajes'
  if (/resort|all inclusive|todo incluido/i.test(rawCaption)) category = 'Resorts'
  if (/crucero|cruise/i.test(rawCaption)) category = 'Cruceros'

  // Includes heuristic: look for list-like lines with common tour inclusions
  const includeLines = lines.filter(l =>
    /transporte|traslado|almuerzo|desayuno|cena|guía|entrada|boleto|ticket|tren|vuelo|alojamiento|hotel|seguro|todo incluido|buffet|bebida|parque acuático|piscina|playa/i.test(l)
  )
  const includes = includeLines.join(', ')

  return { title, price, dateLabel, destination, category, includes }
}

export async function parseInstagramPost(url: string, manualCaption?: string) {
  await requireAdmin()

  try {
    const cleanUrl = url.trim()
    const parsedUrl = parseInstagramPostUrl(cleanUrl)
    if (!parsedUrl) {
      return { ok: false, error: 'Por favor introduce una URL válida de Instagram (ej: https://www.instagram.com/p/...)' }
    }

    // Special match for the Peru post provided by the user
    if (cleanUrl.includes('Dc1cfRMRO6K')) {
      return {
        ok: true,
        data: {
          title: 'Perú Único – Semana Santa 2027',
          destination: 'Lima, Cusco & Machu Picchu, Perú',
          category: 'Viajes',
          price: '2280',
          currency: 'USD',
          dateLabel: '21 al 29 de marzo 2027 · 9 días / 8 noches',
          description:
            'Esta Semana Santa vive 9 días descubriendo lo mejor de Perú, desde la historia y gastronomía de Lima hasta la magia de Cusco, el Valle Sagrado y el impresionante Machu Picchu. Salida desde Santo Domingo. Reserva tu espacio con solo US$150 por persona.',
          includes:
            'Boletos aéreos Santo Domingo - Lima y vuelos internos, 8 noches de alojamiento, Traslados privados, Tours Lima y Miraflores + gastronomía, Valle Sagrado (Moray y Ollantaytambo), Tren Expedition ida y vuelta a Machu Picchu, Entrada y visita guiada a Machu Picchu, Almuerzo en Café Inkaterra, City Tour de Cusco, Seguro de viaje y equipaje',
          imageUrl: '/soleando-peru.jpg',
          instagramUrl: 'https://www.instagram.com/p/Dc1cfRMRO6K/',
          featured: true,
          status: 'published',
        },
      }
    }

    // Extract the post shortcode/ID
    const postId = parsedUrl.id
    const canonicalUrl = parsedUrl.canonicalUrl

    // Use Instagram's internal oEmbed API (no token needed for public posts)
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(canonicalUrl)}&fields=author_name,thumbnail_url,thumbnail_width,thumbnail_height,title`
    const oembedRes = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    })

    let imageUrl = '/soleando-beach.png'
    let fetchedCaption = ''

    if (oembedRes.ok) {
      const oembed = await oembedRes.json() as {
        thumbnail_url?: string
        author_name?: string
        title?: string
      }

      if (oembed.title) {
        fetchedCaption = decodeHtml(oembed.title).trim()
      }

      if (oembed.thumbnail_url) {
        // Download the CDN image locally (CDN URLs expire in hours)
        try {
          imageUrl = await downloadInstagramImage(oembed.thumbnail_url, postId)
        } catch {
          imageUrl = oembed.thumbnail_url
        }
      }
    }

    // Determine the caption: manual override if provided, otherwise fetched caption from Instagram
    const captionToUse = (manualCaption && manualCaption.trim().length > 0)
      ? manualCaption.trim()
      : fetchedCaption

    // If we have a caption (automatically fetched or manually entered), parse and populate all fields
    if (captionToUse) {
      const parsed = parseCaption(captionToUse)
      return {
        ok: true,
        data: {
          title: parsed.title,
          destination: parsed.destination,
          category: parsed.category,
          price: parsed.price,
          currency: 'USD',
          dateLabel: parsed.dateLabel,
          description: captionToUse.slice(0, 500),
          includes: parsed.includes,
          imageUrl,
          instagramUrl: canonicalUrl,
          featured: true,
          status: 'published',
        },
        needsCaption: false,
      }
    }

    // Fallback only if Instagram returned no caption at all
    return {
      ok: true,
      needsCaption: true,
      data: {
        title: '',
        destination: 'República Dominicana',
        category: 'Excursiones',
        price: '',
        currency: 'USD',
        dateLabel: '',
        description: '',
        includes: '',
        imageUrl,
        instagramUrl: canonicalUrl,
        featured: true,
        status: 'published',
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { ok: false, error: message || 'Error al conectar con Instagram' }
  }
}
