import { createProviderHotelSearch, HotelSearchProviderError, searchProviderDestinations } from '@/features/hotels/providers/grupo-gonzalez/grupo-gonzalez-client'
import { providerHotelSearchSchema } from '@/features/hotels/schemas/provider-search'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('query')?.trim() ?? ''
  if (query.length < 3 || query.length > 80) return Response.json({ suggestions: [] })

  try {
    return Response.json(
      { suggestions: await searchProviderDestinations(query) },
      { headers: { 'Cache-Control': 'private, max-age=60' } },
    )
  } catch {
    return Response.json({ suggestions: [] }, { status: 502 })
  }
}

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'La solicitud de búsqueda no es válida.' }, { status: 400 })
  }

  const validation = providerHotelSearchSchema.safeParse(payload)
  if (!validation.success) {
    return Response.json({ error: validation.error.issues[0]?.message ?? 'Revisa los datos de búsqueda.' }, { status: 400 })
  }

  try {
    const redirectUrl = await createProviderHotelSearch(validation.data)
    return Response.json({ redirectUrl }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof HotelSearchProviderError) {
      return Response.json({ error: error.message }, { status: error.status })
    }
    console.error('Hotel provider search failed', error)
    return Response.json({ error: 'No pudimos conectar con el motor de reservas. Inténtalo nuevamente.' }, { status: 502 })
  }
}
