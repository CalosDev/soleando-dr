import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { type NextRequest, NextResponse } from 'next/server'

async function unavailable(req: NextRequest) {
  // Return null session gracefully when database is not configured in local environment
  if (req.nextUrl.pathname.endsWith('/get-session')) {
    return NextResponse.json(null, { status: 200 })
  }
  return NextResponse.json({ error: 'Database is not configured' }, { status: 503 })
}

export const GET = auth ? toNextJsHandler(auth).GET : unavailable
export const POST = auth ? toNextJsHandler(auth).POST : unavailable

