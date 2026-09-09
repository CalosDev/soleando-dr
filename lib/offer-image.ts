import 'server-only'

import { existsSync } from 'fs'
import path from 'path'

const FALLBACK_OFFER_IMAGE = '/soleando-paradise.jpg'
const LOCAL_UPLOAD_PATTERN = /^\/uploads\/[-A-Za-z0-9_.]+$/

/**
 * Keeps legacy offer records renderable when their local upload was not
 * migrated with the database. External and existing local images are left
 * untouched; only a missing local upload gets the public fallback.
 */
export function getOfferImageSrc(imageUrl: string): string {
  if (!LOCAL_UPLOAD_PATTERN.test(imageUrl)) {
    return imageUrl
  }

  const localPath = path.join(process.cwd(), 'public', imageUrl)
  return existsSync(localPath) ? imageUrl : FALLBACK_OFFER_IMAGE
}
