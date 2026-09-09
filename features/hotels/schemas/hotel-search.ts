import { z } from 'zod'
import type { HotelSearchInput, RoomOccupancy } from '@/features/hotels/domain/types'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

function localToday() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santo_Domingo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const value = Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]))
  return `${value.year}-${value.month}-${value.day}`
}

export const roomOccupancySchema = z.object({
  adults: z.coerce.number().int().min(1).max(12),
  childrenAges: z.array(z.coerce.number().int().min(0).max(17)).max(8),
})

export const hotelSearchInputSchema = z.object({
  destination: z.string().trim().min(2).max(120),
  checkIn: z.string().regex(datePattern, 'La fecha de entrada no es válida.'),
  checkOut: z.string().regex(datePattern, 'La fecha de salida no es válida.'),
  rooms: z.array(roomOccupancySchema).min(1).max(8),
}).superRefine((value, context) => {
  const today = localToday()
  if (value.checkIn < today) {
    context.addIssue({ code: 'custom', path: ['checkIn'], message: 'La fecha de entrada no puede ser anterior a hoy.' })
  }
  if (value.checkOut <= value.checkIn) {
    context.addIssue({ code: 'custom', path: ['checkOut'], message: 'La salida debe ser posterior a la entrada.' })
  }
})

export type HotelSearchQuery = {
  destination?: string | string[]
  checkIn?: string | string[]
  checkOut?: string | string[]
  adults?: string | string[]
  rooms?: string | string[]
  childAges?: string | string[]
}

function first(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined
}

function parseInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : fallback
}

function parseChildAges(value: string | undefined) {
  if (!value) return []
  return value.split(',').filter(Boolean).map((age) => Number(age))
}

export function hotelSearchInputFromQuery(query: HotelSearchQuery): HotelSearchInput {
  const destination = first(query.destination)?.replace(/-/g, ' ') ?? ''
  const roomCount = parseInteger(first(query.rooms), 1)
  const adults = parseInteger(first(query.adults), 2)
  const childrenAges = parseChildAges(first(query.childAges))

  const rooms: RoomOccupancy[] = Array.from({ length: roomCount }, (_, index) => ({
    adults: index === 0 ? adults - (roomCount - 1) : 1,
    childrenAges: index === 0 ? childrenAges : [],
  }))

  return {
    destination,
    checkIn: first(query.checkIn) ?? '',
    checkOut: first(query.checkOut) ?? '',
    rooms,
  }
}

export function formatHotelSearchSummary(search: HotelSearchInput) {
  const guests = search.rooms.reduce((total, room) => total + room.adults + room.childrenAges.length, 0)
  const children = search.rooms.reduce((total, room) => total + room.childrenAges.length, 0)
  const adults = guests - children
  const rooms = search.rooms.length
  return [
    search.destination.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    `${search.checkIn} — ${search.checkOut}`,
    `${adults} ${adults === 1 ? 'adulto' : 'adultos'}${children ? ` · ${children} ${children === 1 ? 'niño' : 'niños'}` : ''}`,
    `${rooms} ${rooms === 1 ? 'habitación' : 'habitaciones'}`,
  ].join(' · ')
}
