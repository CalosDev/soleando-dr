import 'server-only'

import { z } from 'zod'

import type { ProviderHotelSearchInput } from '@/features/hotels/schemas/provider-search'

const PROVIDER_ORIGIN = 'https://www.grupogonzalez.com.do'
const MICROSITE_PATH = '/es/microsite/soleandord'
const MICROSITE_URL = `${PROVIDER_ORIGIN}${MICROSITE_PATH}`
const REQUEST_TIMEOUT_MS = 15_000

const destinationSchema = z.array(z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  value: z.string().optional(),
  type: z.string(),
  parent: z.string().optional(),
})).min(1)

const searchResponseSchema = z.object({
  codesearch: z.string().regex(/^[a-zA-Z0-9]+$/),
})

export class HotelSearchProviderError extends Error {
  constructor(message: string, readonly status = 502) {
    super(message)
    this.name = 'HotelSearchProviderError'
  }
}

function providerFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${MICROSITE_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      Referer: MICROSITE_URL,
      'User-Agent': 'SoleandoDR/1.0 hotel-search',
      ...init?.headers,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}

function stripMarkup(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim()
}

function formatProviderDate(value: string): string {
  const [year, month, day] = value.split('-')
  return `${day}-${month}-${year}`
}

function distribute(total: number, buckets: number): number[] {
  return Array.from({ length: buckets }, (_, index) => Math.floor(total / buckets) + (index < total % buckets ? 1 : 0))
}

export interface ProviderDestinationSuggestion {
  id: string
  label: string
  type: string
}

export async function searchProviderDestinations(term: string): Promise<ProviderDestinationSuggestion[]> {
  const query = new URLSearchParams({ term, product: 'hotels', active: 'true' })
  const response = await providerFetch(`/search-destination/search-city-ajax?${query}`)
  if (!response.ok) throw new HotelSearchProviderError('El proveedor no pudo validar el destino.')

  const parsed = destinationSchema.safeParse(await response.json())
  if (!parsed.success) throw new HotelSearchProviderError('El proveedor no devolvió un destino válido.')

  return parsed.data.slice(0, 10).map((item) => ({
    id: item.id,
    label: stripMarkup(item.value ?? item.name),
    type: item.type,
  }))
}

async function resolveDestination(term: string): Promise<ProviderDestinationSuggestion> {
  const suggestions = await searchProviderDestinations(term)
  const normalizedTerm = term.toLocaleLowerCase('es')
  return suggestions.find((item) => item.label.toLocaleLowerCase('es').startsWith(normalizedTerm)) ?? suggestions[0]
}

async function getSearchToken(): Promise<string> {
  const response = await providerFetch('/engine/v2?type=hotel', { headers: { Accept: 'text/html' } })
  if (!response.ok) throw new HotelSearchProviderError('El motor de reservas no está disponible temporalmente.')

  const source = await response.text()
  const token = source.match(/name="searchhotel&#x5B;token&#x5D;"[^>]+value="([a-zA-Z0-9]+)"/)?.[1]
  if (!token) throw new HotelSearchProviderError('No fue posible iniciar una búsqueda segura.')
  return token
}

export async function createProviderHotelSearch(input: ProviderHotelSearchInput): Promise<string> {
  const [destination, token] = await Promise.all([
    input.providerDestinationId && input.providerDestinationType
      ? Promise.resolve({ id: input.providerDestinationId, label: input.destination, type: input.providerDestinationType })
      : resolveDestination(input.destination),
    getSearchToken(),
  ])

  const nights = Math.round(
    (Date.parse(`${input.checkOut}T00:00:00Z`) - Date.parse(`${input.checkIn}T00:00:00Z`)) / 86_400_000,
  )
  const adultsByRoom = distribute(input.adults, input.rooms)
  const childrenByRoom = Array.from({ length: input.rooms }, () => [] as number[])
  input.childrenAges.forEach((age, index) => childrenByRoom[index % input.rooms].push(age))

  const body = new URLSearchParams({
    'searchhotel[destiny]': destination.label,
    'searchhotel[searchType]': destination.type,
    'searchhotel[destination]': destination.id,
    'searchhotel[checkin]': formatProviderDate(input.checkIn),
    'searchhotel[nights]': String(nights),
    'searchhotel[checkout]': formatProviderDate(input.checkOut),
    'searchhotel[rooms]': String(input.rooms),
    'searchhotel[nationality]': '96',
    'searchhotel[token]': token,
  })

  for (let room = 0; room < input.rooms; room += 1) {
    body.set(`searchhotel[listrooms][${room}][numroom]`, String(room + 1))
    body.set(`searchhotel[listrooms][${room}][adults]`, String(adultsByRoom[room]))
    body.set(`searchhotel[listrooms][${room}][children]`, String(childrenByRoom[room].length))
    childrenByRoom[room].forEach((age, index) => {
      body.set(`searchhotel[listrooms][${room}][childrenages][${index}][age]`, String(age))
    })
  }

  const response = await providerFetch('/search-hotel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body,
  })
  if (!response.ok) throw new HotelSearchProviderError('El proveedor no pudo completar la búsqueda.')

  const parsed = searchResponseSchema.safeParse(await response.json())
  if (!parsed.success) throw new HotelSearchProviderError('La búsqueda no produjo resultados válidos.')

  return `${MICROSITE_URL}/list-hotel/${parsed.data.codesearch}`
}
