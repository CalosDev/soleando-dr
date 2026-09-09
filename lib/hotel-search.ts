import { z } from 'zod'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const hotelSearchSchema = z.object({
  destination: z.string().trim().min(1).optional(),
  checkIn: z.string().regex(datePattern).optional(),
  checkOut: z.string().regex(datePattern).optional(),
  adults: z.coerce.number().int().min(1).max(12).default(2),
  children: z.coerce.number().int().min(0).max(8).default(0),
  rooms: z.coerce.number().int().min(1).max(6).default(1),
}).superRefine((value, context) => {
  if (value.checkIn && value.checkOut && value.checkOut <= value.checkIn) {
    context.addIssue({ code: 'custom', path: ['checkOut'], message: 'La salida debe ser posterior a la entrada.' })
  }
})

export type HotelSearchParams = z.infer<typeof hotelSearchSchema>

export function formatSearchSummary(search: HotelSearchParams) {
  const destination = search.destination?.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const guests = `${search.adults} ${search.adults === 1 ? 'adulto' : 'adultos'}${search.children ? ` · ${search.children} ${search.children === 1 ? 'niño' : 'niños'}` : ''}`
  const rooms = `${search.rooms} ${search.rooms === 1 ? 'habitación' : 'habitaciones'}`
  return [destination, search.checkIn && search.checkOut ? `${search.checkIn} — ${search.checkOut}` : undefined, guests, rooms].filter(Boolean).join(' · ')
}
