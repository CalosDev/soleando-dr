import 'server-only'

import { lookup } from 'dns/promises'
import { mkdir, writeFile } from 'fs/promises'
import { BlockList } from 'net'
import path from 'path'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const META_CDN_SUFFIXES = ['.cdninstagram.com', '.fbcdn.net']

const privateNetworks = new BlockList()
privateNetworks.addSubnet('0.0.0.0', 8, 'ipv4')
privateNetworks.addSubnet('10.0.0.0', 8, 'ipv4')
privateNetworks.addSubnet('100.64.0.0', 10, 'ipv4')
privateNetworks.addSubnet('127.0.0.0', 8, 'ipv4')
privateNetworks.addSubnet('169.254.0.0', 16, 'ipv4')
privateNetworks.addSubnet('172.16.0.0', 12, 'ipv4')
privateNetworks.addSubnet('192.0.0.0', 24, 'ipv4')
privateNetworks.addSubnet('192.168.0.0', 16, 'ipv4')
privateNetworks.addSubnet('198.18.0.0', 15, 'ipv4')
privateNetworks.addSubnet('224.0.0.0', 4, 'ipv4')
privateNetworks.addSubnet('240.0.0.0', 4, 'ipv4')
privateNetworks.addAddress('::', 'ipv6')
privateNetworks.addAddress('::1', 'ipv6')
privateNetworks.addSubnet('fc00::', 7, 'ipv6')
privateNetworks.addSubnet('fe80::', 10, 'ipv6')
privateNetworks.addSubnet('ff00::', 8, 'ipv6')

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

async function readBodyWithLimit(response: Response) {
  if (!response.body) {
    throw new ImageValidationError('Instagram no devolvió una imagen válida', 502)
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > MAX_IMAGE_BYTES) {
        await reader.cancel()
        throw new ImageValidationError('La imagen remota supera el límite de 5 MB', 413)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), totalBytes)
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

function isAllowedMetaCdnHost(hostname: string) {
  const normalized = hostname.toLowerCase()
  return META_CDN_SUFFIXES.some((suffix) => normalized.endsWith(suffix))
}

async function validateRemoteImageUrl(value: string) {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new ImageValidationError('URL de imagen inválida', 400)
  }

  if (url.protocol !== 'https:' || url.username || url.password || url.port || !isAllowedMetaCdnHost(url.hostname)) {
    throw new ImageValidationError('El host de la imagen no está permitido', 400)
  }

  const addresses = await lookup(url.hostname, { all: true, verbatim: true })
  if (addresses.length === 0 || addresses.some(({ address, family }) => privateNetworks.check(address, family === 6 ? 'ipv6' : 'ipv4'))) {
    throw new ImageValidationError('La dirección de la imagen no está permitida', 400)
  }

  return url
}

export async function downloadInstagramImage(value: string, postId: string) {
  const url = await validateRemoteImageUrl(value)
  const safeId = postId.match(/^[A-Za-z0-9_-]{1,64}$/)?.[0]
  if (!safeId) throw new ImageValidationError('Identificador de publicación inválido', 400)

  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        Referer: 'https://www.instagram.com/',
        'User-Agent': 'Soleando/1.0',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(10_000),
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new ImageValidationError('La descarga de Instagram agotó el tiempo de espera', 504)
    }
    throw new ImageValidationError('No se pudo descargar la imagen de Instagram', 502)
  }

  if (!response.ok) {
    throw new ImageValidationError('Instagram no devolvió una imagen válida', 502)
  }

  const declaredLength = Number(response.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_IMAGE_BYTES) {
    throw new ImageValidationError('La imagen remota supera el límite de 5 MB', 413)
  }

  const buffer = await readBodyWithLimit(response)
  const kind = validateImageBuffer(buffer, response.headers.get('content-type')?.split(';')[0])
  const igDir = path.join(process.cwd(), 'public', 'ig')
  const filename = `ig-${safeId}.${kind.extension}`

  await mkdir(igDir, { recursive: true })
  await writeFile(path.join(igDir, filename), buffer)
  return `/ig/${filename}`
}
