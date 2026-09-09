import 'server-only'

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

type ImageKind = {
  extension: 'jpg' | 'png' | 'webp'
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp'
}

export class ImageValidationError extends Error {
  readonly status: 400 | 413 | 415 | 502 | 504

  constructor(message: string, status: 400 | 413 | 415 | 502 | 504) {
    super(message)
    this.name = 'ImageValidationError'
    this.status = status
  }
}

function detectImageKind(buffer: Buffer): ImageKind | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { extension: 'jpg', mimeType: 'image/jpeg' }
  }

  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { extension: 'png', mimeType: 'image/png' }
  }

  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { extension: 'webp', mimeType: 'image/webp' }
  }

  return null
}

function validateImageBuffer(buffer: Buffer, declaredMimeType?: string) {
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new ImageValidationError('La imagen supera el límite de 5 MB', 413)
  }

  const kind = detectImageKind(buffer)
  if (!kind) {
    throw new ImageValidationError('Solo se permiten imágenes JPEG, PNG o WEBP válidas', 415)
  }

  if (declaredMimeType && declaredMimeType !== kind.mimeType) {
    throw new ImageValidationError('El tipo declarado no coincide con el contenido de la imagen', 415)
  }

  return kind
}

export async function saveUploadedImage(file: File) {
  if (file.size === 0) throw new ImageValidationError('El archivo está vacío', 400)
  if (file.size > MAX_IMAGE_BYTES) throw new ImageValidationError('La imagen supera el límite de 5 MB', 413)

  const buffer = Buffer.from(await file.arrayBuffer())
  const kind = validateImageBuffer(buffer, file.type)
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  const fileName = `${crypto.randomUUID()}.${kind.extension}`

  await mkdir(uploadsDir, { recursive: true })
  await writeFile(path.join(uploadsDir, fileName), buffer, { flag: 'wx' })
  return `/uploads/${fileName}`
}
