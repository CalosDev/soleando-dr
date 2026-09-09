import { z } from 'zod'

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  lastName: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio')
    .max(100, 'El apellido no puede exceder 100 caracteres'),
  phone: z
    .string()
    .trim()
    .max(25, 'El teléfono no puede exceder 25 caracteres')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : null)),
  countryCode: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null
      const upper = val.trim().toUpperCase()
      return upper.length === 2 ? upper : null
    }),
})

export type ProfileInput = z.infer<typeof profileSchema>
