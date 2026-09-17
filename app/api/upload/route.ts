import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-session'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const STORAGE_BUCKET = 'soleando-media'

function getImageType(bytes: Uint8Array): { mime: string; extension: string } | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: 'image/jpeg', extension: 'jpg' }
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { mime: 'image/png', extension: 'png' }
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return { mime: 'image/webp', extension: 'webp' }
  return null
}

export async function POST(req: NextRequest) {
  try {
    // 1. Strict admin authorization check
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado. Se requieren permisos de administrador.' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No se envió ningún archivo válido' }, { status: 400 })
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'El archivo debe tener un tamaño máximo de 5 MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const imageType = getImageType(new Uint8Array(bytes))
    if (!imageType) return NextResponse.json({ error: 'Formato no permitido. Solo se aceptan imágenes JPG, PNG o WebP.' }, { status: 400 })

    const storageUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!storageUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'La carga de imágenes aún no está configurada.' }, { status: 503 })
    }

    const filePath = `catalog/${crypto.randomUUID()}.${imageType.extension}`
    const response = await fetch(`${storageUrl}/storage/v1/object/${STORAGE_BUCKET}/${filePath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        'Content-Type': imageType.mime,
        'x-upsert': 'false',
      },
      body: bytes,
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Supabase Storage upload failed', response.status)
      return NextResponse.json({ error: 'No pudimos guardar la imagen. Inténtalo nuevamente.' }, { status: 502 })
    }

    return NextResponse.json({ url: `${storageUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}` })
  } catch (err: unknown) {
    console.error('Error al procesar carga de archivo:', err)
    return NextResponse.json({ error: 'Error al procesar la imagen' }, { status: 500 })
  }
}
