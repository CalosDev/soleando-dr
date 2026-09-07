import { NextResponse } from 'next/server'
import { readIgPosts, type ManagedIgPost } from '@/lib/ig-feed-store'

export const dynamic = 'force-dynamic'

export type IgPost = {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
  caption?: string
  likesCount?: number
  location?: string
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const managedPosts = readIgPosts()

  if (!token) {
    return NextResponse.json({
      posts: managedPosts,
      source: 'managed',
      profileUrl: 'https://www.instagram.com/soleandodr/',
    })
  }

  try {
    const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
    const apiUrl = `https://graph.instagram.com/me/media?fields=${fields}&limit=12&access_token=${token}`

    const res = await fetch(apiUrl, { cache: 'no-store' })

    if (res.ok) {
      const data = (await res.json()) as { data?: ManagedIgPost[] }
      if (data.data && data.data.length > 0) {
        return NextResponse.json({
          posts: data.data,
          source: 'live',
          profileUrl: 'https://www.instagram.com/soleandodr/',
        })
      }
    }
  } catch (err) {
    console.error('[Instagram Feed] API fetch error:', err)
  }

  // Fallback to managed posts if live array is empty or token request fails
  return NextResponse.json({
    posts: managedPosts,
    source: 'managed_fallback',
    profileUrl: 'https://www.instagram.com/soleandodr/',
  })
}
