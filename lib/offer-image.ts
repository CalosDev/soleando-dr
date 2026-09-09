import 'server-only'

import { existsSync } from 'fs'
import path from 'path'

const LOCAL_UPLOAD_PATTERN = /^\/uploads\/[-A-Za-z0-9_.]+$/

/**
 * Keeps legacy offer records renderable when their local upload was not
 * migrated with the database. External and existing local images are left
 * untouched; callers can render an explicit fallback when a local upload is
 * missing instead of showing an unrelated destination image.
 */
export function getOfferImageSrc(imageUrl: string): string | null {
  if (!LOCAL_UPLOAD_PATTERN.test(imageUrl)) {
    return imageUrl
  }

  const localPath = path.join(process.cwd(), 'public', imageUrl)
  return existsSync(localPath) ? imageUrl : null
}
