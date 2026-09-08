const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com'])

export type InstagramPostUrl = {
  canonicalUrl: string
  id: string
  isVideo: boolean
  permalink: string
}

export function parseInstagramPostUrl(value: string): InstagramPostUrl | null {
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || !INSTAGRAM_HOSTS.has(url.hostname.toLowerCase())) {
      return null
    }

    const match = url.pathname.match(/^\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)\/?$/)
    if (!match) return null

    const [, kind, id] = match
    return {
      canonicalUrl: `https://www.instagram.com/p/${id}/`,
      id,
      isVideo: kind === 'reel' || kind === 'reels',
      permalink: `https://www.instagram.com/${kind}/${id}/`,
    }
  } catch {
    return null
  }
}
