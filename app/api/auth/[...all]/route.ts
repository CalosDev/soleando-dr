import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { NextResponse } from 'next/server'

const handlers = auth ? toNextJsHandler(auth) : null

function unavailable() {
  return NextResponse.json(
    { error: 'Authentication service is not configured' },
    { status: 503 },
  )
}

export const GET = handlers?.GET ?? unavailable
export const POST = handlers?.POST ?? unavailable
