import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().email('Introduce un correo electrónico válido'),
  password: z.string().min(1, 'Introduce tu contraseña'),
})

export type SignInInput = z.infer<typeof signInSchema>

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().trim().email('Introduce un correo electrónico válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

/**
 * Sanitizes a redirect path to ensure it is internal and relative,
 * preventing open-redirect vulnerabilities.
 */
export function getSafeRedirectPath(rawPath?: string | null, fallback: string = '/cuenta'): string {
  if (!rawPath || typeof rawPath !== 'string') {
    return fallback
  }

  const trimmed = rawPath.trim()

  // Must begin with a single slash, not double slashes (protocol-relative) or backslashes
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.includes('\\')) {
    return fallback
  }

  try {
    const dummyOrigin = 'http://localhost'
    const parsed = new URL(trimmed, dummyOrigin)
    // Ensure the host didn't change (e.g. via clever bypasses)
    if (parsed.origin !== dummyOrigin) {
      return fallback
    }
    return parsed.pathname + parsed.search + parsed.hash
  } catch {
    return fallback
  }
}
