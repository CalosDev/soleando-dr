import { NextRequest, NextResponse } from 'next/server'
import { adminAuthorizationResponse, requireAdmin } from '@/lib/admin-auth'
import { ImageValidationError, saveUploadedImage } from '@/lib/server-image-files'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req.headers)
  } catch (error) {
    return adminAuthorizationResponse(error)
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    const url = await saveUploadedImage(file)
    return NextResponse.json({ url })
  } catch (err: unknown) {
    if (err instanceof ImageValidationError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('Error al subir imagen:', err)
    return NextResponse.json({ error: 'Error al procesar la imagen' }, { status: 500 })
  }
}
