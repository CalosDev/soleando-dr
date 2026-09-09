export class HotelSearchValidationError extends Error {
  constructor(message = 'La búsqueda de hoteles contiene datos inválidos.') {
    super(message)
    this.name = 'HotelSearchValidationError'
  }
}

export class HotelProviderUnavailableError extends Error {
  constructor() {
    super('El proveedor de hoteles no está disponible.')
    this.name = 'HotelProviderUnavailableError'
  }
}

export class HotelNotFoundError extends Error {
  constructor() {
    super('El hotel solicitado no existe.')
    this.name = 'HotelNotFoundError'
  }
}
