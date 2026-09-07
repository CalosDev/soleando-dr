import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

/**
 * POST /api/ig-image
 * Downloads an Instagram CDN image URL and saves it to /public/ig/
 * Returns the local path so it can be stored in the database.
 *
 * Body: { url: string, postId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { url, postId } = await req.json() as { url: string; postId: string }

    if (!url || !postId) {
      return NextResponse.json({ error: 'Missing url or postId' }, { status: 400 })
    }

    // Download the image from Instagram CDN
    const igRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/',
      },
    })

    if (!igRes.ok) {
      return NextResponse.json({ error: `Failed to download image: ${igRes.status}` }, { status: 502 })
    }

    const contentType = igRes.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'

    // Sanitize postId to be a safe filename
    const safeId = postId.replace(/[^A-Za-z0-9_\-]/g, '').slice(0, 30)
    const filename = `ig-${safeId}.${ext}`

    // Save to /public/ig/
    const igDir = path.join(process.cwd(), 'public', 'ig')
    if (!fs.existsSync(igDir)) {
      fs.mkdirSync(igDir, { recursive: true })
    }

    const filePath = path.join(igDir, filename)
    const buffer = Buffer.from(await igRes.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    const localPath = `/ig/${filename}`
    return NextResponse.json({ ok: true, localPath })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
