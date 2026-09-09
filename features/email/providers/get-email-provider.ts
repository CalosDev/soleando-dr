import 'server-only'

import type { EmailProvider } from './email-provider'
import { DevEmailProvider } from './dev/dev-email-provider'
import { ResendEmailProvider } from './resend/resend-email-provider'
import { EmailConfigurationError } from '../domain/errors'

let cachedProvider: EmailProvider | null = null

/**
 * Factory central para resolver el EmailProvider activo.
 * Implementa Production Guard (Fail-Closed):
 * En producción NUNCA se permite el uso silencioso del DevEmailProvider.
 */
export function getEmailProvider(): EmailProvider {
  if (cachedProvider) {
    return cachedProvider
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const requestedProvider = (process.env.EMAIL_PROVIDER || (isProduction ? 'resend' : 'dev')).toLowerCase()

  if (isProduction) {
    if (requestedProvider === 'dev') {
      throw new EmailConfigurationError(
        'El proveedor "dev" está estrictamente deshabilitado en producción. Configura EMAIL_PROVIDER=resend y RESEND_API_KEY.'
      )
    }

    if (requestedProvider === 'resend') {
      if (!process.env.RESEND_API_KEY) {
        throw new EmailConfigurationError(
          'RESEND_API_KEY es obligatoria en producción cuando EMAIL_PROVIDER=resend.'
        )
      }
      cachedProvider = new ResendEmailProvider()
      return cachedProvider
    }

    throw new EmailConfigurationError(
      `Proveedor de correo no reconocido para producción: "${requestedProvider}".`
    )
  }

  // Entorno de desarrollo o pruebas
  if (requestedProvider === 'resend' && process.env.RESEND_API_KEY) {
    cachedProvider = new ResendEmailProvider()
    return cachedProvider
  }

  cachedProvider = new DevEmailProvider()
  return cachedProvider
}

/**
 * Permite resetear la instancia en tests
 */
export function resetEmailProviderCache(): void {
  cachedProvider = null
}
