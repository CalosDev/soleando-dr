import { NextRequest, NextResponse } from 'next/server'
import { adminAuthorizationResponse, requireAdmin } from '@/lib/admin-auth'
import { downloadInstagramImage, ImageValidationError } from '@/lib/server-image-files'

/**
 * POST /api/ig-image
 * Downloads an Instagram CDN image URL and saves it to /public/ig/
 * Returns the local path so it can be stored in the database.
 *
 * Body: { url: string, postId: string }
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req.headers)
  } catch (error) {
    return adminAuthorizationResponse(error)
  }

  try {
    const { url, postId } = await req.json() as { url: string; postId: string }

    if (!url || !postId) {
      return NextResponse.json({ error: 'Missing url or postId' }, { status: 400 })
    }

    const localPath = await downloadInstagramImage(url, postId)
    return NextResponse.json({ ok: true, localPath })
  } catch (err: unknown) {
    if (err instanceof ImageValidationError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
