import { z } from 'zod'

export const travelerSchema = z
  .object({
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
    dateOfBirth: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => (val && val.trim().length > 0 ? val.trim() : null)),
    nationalityCode: z
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
  .refine(
    (data) => {
      if (!data.dateOfBirth) return true
      // Validate dateOfBirth format YYYY-MM-DD and not in the future
      const parsedDate = new Date(data.dateOfBirth + 'T00:00:00')
      if (isNaN(parsedDate.getTime())) return false

      const today = new Date()
      today.setHours(23, 59, 59, 999)
      return parsedDate <= today
    },
    {
      message: 'La fecha de nacimiento no puede ser futura ni inválida.',
      path: ['dateOfBirth'],
    }
  )

export type TravelerInput = z.infer<typeof travelerSchema>
