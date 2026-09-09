import { z } from 'zod'

const optionalPhone = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().trim().max(40, 'El teléfono es demasiado largo.').regex(/^[+0-9()\s-]+$/, 'Introduce un teléfono válido.').optional(),
)

const optionalCountryCode = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().trim().toUpperCase().length(2, 'Selecciona un país válido.').regex(/^[A-Z]{2}$/, 'Selecciona un país válido.').optional(),
)

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'Introduce tu nombre.').max(100, 'El nombre es demasiado largo.'),
  lastName: z.string().trim().min(1, 'Introduce tu apellido.').max(100, 'El apellido es demasiado largo.'),
  phone: optionalPhone,
  countryCode: optionalCountryCode,
})

export type ProfileInput = z.infer<typeof profileSchema>
