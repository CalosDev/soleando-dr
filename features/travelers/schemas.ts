import { z } from 'zod'

const optionalCountryCode = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().trim().toUpperCase().length(2, 'Selecciona una nacionalidad válida.').regex(/^[A-Z]{2}$/, 'Selecciona una nacionalidad válida.').optional(),
)

const optionalDateOfBirth = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().date('Introduce una fecha válida.').refine(
    (value) => new Date(`${value}T00:00:00.000Z`) <= new Date(),
    'La fecha de nacimiento no puede ser futura.',
  ).optional(),
)

export const travelerSchema = z.object({
  firstName: z.string().trim().min(1, 'Introduce el nombre.').max(100, 'El nombre es demasiado largo.'),
  lastName: z.string().trim().min(1, 'Introduce el apellido.').max(100, 'El apellido es demasiado largo.'),
  dateOfBirth: optionalDateOfBirth,
  nationalityCode: optionalCountryCode,
})

export const travelerIdSchema = z.string().uuid()
export type TravelerInput = z.infer<typeof travelerSchema>
