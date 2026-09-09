import { z } from 'zod'

const normalizedEmail = z.string().trim().toLowerCase().email('Introduce un correo electrónico válido.')
const password = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').max(128, 'La contraseña no puede superar 128 caracteres.')

export const signInSchema = z.object({
  email: normalizedEmail,
  password: z.string().min(1, 'Introduce tu contraseña.'),
})

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Introduce tu nombre.').max(120, 'El nombre es demasiado largo.'),
  email: normalizedEmail,
  password,
  confirmPassword: z.string(),
}).superRefine(({ password: value, confirmPassword }, context) => {
  if (value !== confirmPassword) {
    context.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Las contraseñas no coinciden.' })
  }
})
