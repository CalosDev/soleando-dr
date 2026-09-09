/**
 * Soleando DR — Email Domain Errors
 * Normalización de errores para impedir filtrado de respuestas crudas o API keys
 */

export class EmailError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmailError'
  }
}

export class EmailProviderError extends EmailError {
  public readonly provider: string
  public readonly statusCode?: number

  constructor(provider: string, message: string, statusCode?: number) {
    super(`Error en proveedor de correo (${provider}): ${message}`)
    this.name = 'EmailProviderError'
    this.provider = provider
    this.statusCode = statusCode
  }
}

export class EmailProviderUnavailableError extends EmailError {
  public readonly provider: string

  constructor(provider: string, message: string = 'Servicio no disponible') {
    super(`Proveedor de correo temporalmente no disponible (${provider}): ${message}`)
    this.name = 'EmailProviderUnavailableError'
    this.provider = provider
  }
}

export class EmailConfigurationError extends EmailError {
  constructor(message: string) {
    super(`Error de configuración de email: ${message}`)
    this.name = 'EmailConfigurationError'
  }
}
