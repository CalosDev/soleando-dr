import { z } from 'zod'
import { type HotelSearchInput, type RoomOccupancy } from '../domain/types'

export const roomOccupancySchema = z.object({
  adults: z.number().int().min(1, 'Debe haber al menos 1 adulto por habitación').default(2),
  childrenAges: z
    .array(z.number().int().min(0, 'La edad no puede ser negativa').max(17, 'La edad de menor debe ser menor a 18'))
    .default([]),
})

export const hotelSearchInputSchema = z
  .object({
    destination: z.string().trim().min(1, 'El destino es obligatorio'),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha de check-in inválido (YYYY-MM-DD)'),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha de check-out inválido (YYYY-MM-DD)'),
    rooms: z.array(roomOccupancySchema).min(1, 'Debe incluir al menos 1 habitación'),
  })
  .refine(
    (data) => {
      // Must be checkOut > checkIn
      return data.checkOut > data.checkIn
    },
    {
      message: 'La fecha de check-out debe ser posterior a la fecha de check-in.',
      path: ['checkOut'],
    }
  )

/**
 * Safely parses URL search parameters into a normalized HotelSearchInput.
 * Returns null if essential search parameters are missing or invalid.
 */
export function parseHotelSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): HotelSearchInput | null {
  const getSingle = (val: string | string[] | undefined): string => {
    if (Array.isArray(val)) return val[0] || ''
    return val || ''
  }

  const destination = getSingle(searchParams.destination).trim()
  if (!destination) {
    return null
  }

  // Get or default dates
  let checkIn = getSingle(searchParams.checkIn).trim()
  let checkOut = getSingle(searchParams.checkOut).trim()

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  if (!checkIn || checkIn < todayStr) {
    const inDate = new Date(today.getTime() + 7 * 86400000)
    checkIn = inDate.toISOString().split('T')[0]
  }

  if (!checkOut || checkOut <= checkIn) {
    const inObj = new Date(checkIn + 'T00:00:00')
    const outDate = new Date(inObj.getTime() + 4 * 86400000)
    checkOut = outDate.toISOString().split('T')[0]
  }

  // Occupancy parsing
  const adultsNum = parseInt(getSingle(searchParams.adults), 10)
  const adults = !isNaN(adultsNum) && adultsNum >= 1 ? adultsNum : 2

  const childrenNum = parseInt(getSingle(searchParams.children), 10)
  const children = !isNaN(childrenNum) && childrenNum >= 0 ? childrenNum : 0

  const roomsNum = parseInt(getSingle(searchParams.rooms), 10)
  const roomCount = !isNaN(roomsNum) && roomsNum >= 1 && roomsNum <= 8 ? roomsNum : 1

  // Parse children ages if provided (e.g. childAges=8,10)
  const rawAges = getSingle(searchParams.childAges || searchParams.childrenAges)
  let parsedAges: number[] = []
  if (rawAges) {
    parsedAges = rawAges
      .split(',')
      .map((a) => parseInt(a.trim(), 10))
      .filter((a) => !isNaN(a) && a >= 0 && a <= 17)
  }

  // If children count is specified but ages were not provided, fill with default realistic child ages (e.g. 7)
  if (parsedAges.length < children) {
    const missing = children - parsedAges.length
    for (let i = 0; i < missing; i++) {
      parsedAges.push(7)
    }
  }

  // Distribute occupancy into rooms
  const rooms: RoomOccupancy[] = []
  const adultsPerRoom = Math.max(1, Math.floor(adults / roomCount))
  let remainingAdults = adults

  for (let i = 0; i < roomCount; i++) {
    const isLast = i === roomCount - 1
    const roomAdults = isLast ? remainingAdults : adultsPerRoom
    remainingAdults -= roomAdults

    // Assign children ages to first room initially
    const roomChildAges = i === 0 ? parsedAges : []

    rooms.push({
      adults: Math.max(1, roomAdults),
      childrenAges: roomChildAges,
    })
  }

  const rawInput = {
    destination,
    checkIn,
    checkOut,
    rooms,
  }

  const validation = hotelSearchInputSchema.safeParse(rawInput)
  if (!validation.success) {
    return null
  }

  return validation.data
}
