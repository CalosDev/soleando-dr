export class HotelProviderError extends Error {
  readonly code: string
  readonly provider: string
  readonly retryable: boolean

  constructor(message: string, options: { code?: string; provider?: string; retryable?: boolean; cause?: unknown } = {}) {
    super(message)
    this.name = 'HotelProviderError'
    this.code = options.code || 'HOTEL_PROVIDER_ERROR'
    this.provider = options.provider || 'unknown'
    this.retryable = options.retryable ?? false
    if (options.cause) {
      this.cause = options.cause
    }
  }
}

export class HotelProviderUnavailableError extends HotelProviderError {
  constructor(message: string = 'El servicio de hoteles no está disponible en este momento.', options: { provider?: string; cause?: unknown } = {}) {
    super(message, {
      code: 'HOTEL_PROVIDER_UNAVAILABLE',
      provider: options.provider || 'unknown',
      retryable: true,
      cause: options.cause,
    })
    this.name = 'HotelProviderUnavailableError'
  }
}

export class HotelNotFoundError extends HotelProviderError {
  constructor(hotelId: string, options: { provider?: string } = {}) {
    super(`No se encontró el hotel solicitado: ${hotelId}`, {
      code: 'HOTEL_NOT_FOUND',
      provider: options.provider || 'unknown',
      retryable: false,
    })
    this.name = 'HotelNotFoundError'
  }
}

export class HotelRateUnavailableError extends HotelProviderError {
  constructor(rateKey: string, options: { provider?: string } = {}) {
    super(`La tarifa seleccionada ya no está disponible o ha expirado.`, {
      code: 'HOTEL_RATE_UNAVAILABLE',
      provider: options.provider || 'unknown',
      retryable: false,
    })
    this.name = 'HotelRateUnavailableError'
  }
}

export class HotelValidationError extends HotelProviderError {
  constructor(message: string) {
    super(message, {
      code: 'HOTEL_VALIDATION_ERROR',
      provider: 'domain',
      retryable: false,
    })
    this.name = 'HotelValidationError'
  }
}
