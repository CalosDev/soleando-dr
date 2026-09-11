import { z } from 'zod'

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const providerHotelSearchSchema = z
  .object({
    destination: z.string().trim().min(2).max(160),
    providerDestinationId: z.string().regex(/^[a-zA-Z0-9]+$/).max(40).optional(),
    providerDestinationType: z.string().trim().min(1).max(40).optional(),
    checkIn: isoDateSchema,
    checkOut: isoDateSchema,
    adults: z.number().int().min(1).max(10),
    childrenAges: z.array(z.number().int().min(0).max(17)).max(6),
    rooms: z.number().int().min(1).max(5),
  })
  .superRefine((value, context) => {
    const today = new Date().toISOString().slice(0, 10)
    const start = Date.parse(`${value.checkIn}T00:00:00Z`)
    const end = Date.parse(`${value.checkOut}T00:00:00Z`)
    const nights = Math.round((end - start) / 86_400_000)

    if (value.checkIn < today) {
      context.addIssue({ code: 'custom', path: ['checkIn'], message: 'La entrada no puede estar en el pasado.' })
    }
    if (!Number.isFinite(nights) || nights < 1 || nights > 30) {
      context.addIssue({ code: 'custom', path: ['checkOut'], message: 'La estancia debe ser de 1 a 30 noches.' })
    }
    if (value.rooms > value.adults) {
      context.addIssue({ code: 'custom', path: ['rooms'], message: 'Cada habitación necesita al menos un adulto.' })
    }
    if (value.childrenAges.length > value.rooms * 4) {
      context.addIssue({ code: 'custom', path: ['childrenAges'], message: 'El proveedor admite hasta 4 menores por habitación.' })
    }
  })

export type ProviderHotelSearchInput = z.infer<typeof providerHotelSearchSchema>
