# Arquitectura de Proveedores Hoteleros — Soleando DR

## 1. Propósito del Adapter Pattern

Soleando DR no acopla su interfaz gráfica ni sus páginas públicas a ningún proveedor hotelero externo (Hotelbeds, Expedia Rapid, RateHawk, etc.).

Toda la interacción hotelera se rige por el contrato `HotelProvider`:

```
               SOLEANDO UI (/hoteles, Buscador)
                             │
                             ▼
                       Hotel Services
               (searchHotels, getHotelDetails, etc.)
                             │
                             ▼
                       HotelProvider (Contrato)
                             │
               ┌─────────────┴─────────────┐
               ▼                           ▼
       MockHotelProvider            HotelbedsProvider / Expedia
   (Determinista, Offline)               (Fase 6+)
```

Este desacoplamiento garantiza que cambiar de mayorista hotelero o añadir múltiples fuentes no requiera modificar la Home, los componentes de tarjetas (`HotelCard`) ni los formularios de búsqueda.

---

## 2. Tipos Normalizados del Dominio

Todas las entidades hoteleras residen en `features/hotels/domain/types.ts`:

- **`HotelReference`**: `{ provider: string, id: string }` — Evita colisiones de identificadores y asunciones de unicidad global.
- **`Money`**: `{ amount: string, currency: string }` — El monto se almacena como string decimal para evitar distorsiones aritméticas de punto flotante binario (IEEE-754).
- **`RoomOccupancy`**: `{ adults: number, childrenAges: number[] }` — Estructura granular por habitación con edades individuales de menores.
- **`HotelSearchResult`**: Resumen normalizado con estrellas, régimen de comida, amenidades y precio referencial `Desde`.
- **`HotelDetails`**: Ficha técnica con descripción, coordenadas geográficas, imágenes normalizadas y políticas de alojamiento.
- **`HotelAvailability` & `AvailableRoom`**: Disponibilidad en tiempo real para las fechas seleccionadas.
- **`HotelRate`**: Tarifa revalidada mediante una clave de tarifa opaca (`rateKey`) con estado (`available`, `changed`, `unavailable`).

---

## 3. Funcionamiento de MockHotelProvider

El `MockHotelProvider` es una implementación determinista y fuera de línea:
- No realiza peticiones de red externas ni utiliza `Math.random()`.
- Utiliza un catálogo de 6 resorts dominicanos en Punta Cana, Bayahíbe, La Romana y Cap Cana (`MOCK_HOTEL_ENTITIES`).
- Permite simular escenarios controlados en pruebas unitarias mediante rateKeys sintéticas (ej. `test-rate-changed`, `test-rate-unavailable`).

---

## 4. Production Guard (Fail-Closed)

Para garantizar la veracidad comercial del producto y evitar que usuarios en producción vean disponibilidad o tarifas simuladas:
- Si `NODE_ENV === 'production'` y `HOTEL_PROVIDER === 'mock'`, el factory `getHotelProvider()` responde con `UnavailableHotelProvider`.
- Esto dispara de inmediato un estado amigable en la interfaz indicando que el motor en vivo está en mantenimiento y ofreciendo contacto directo por WhatsApp, sin devolver inventario ficticio.

---

## 5. Lo que NO pertenece a HotelProvider

- **Métodos de Reserva o Pago**: `createBooking`, `cancelBooking`, `refund`. *(Se incorporarán en la Fase 9 una vez se conozca la máquina de estados del proveedor real)*.
- **Persistencia en PostgreSQL**: El catálogo dinámico del proveedor no se almacena en la base de datos de Soleando en esta fase.
- **Credenciales en el Cliente**: Todos los providers son estrictamente `server-only`.

---

## 6. Guía para Agregar un Nuevo Proveedor

Cuando se confirme el proveedor hotelero definitivo (ej. Hotelbeds):
1. Crear carpeta `features/hotels/providers/hotelbeds/`.
2. Implementar la interfaz `HotelProvider` en `hotelbeds-provider.ts`:
   - `searchHotels(input: HotelSearchInput): Promise<HotelSearchResult[]>`
   - `getHotelDetails(reference: HotelReference): Promise<HotelDetails | null>`
   - `getAvailability(reference: HotelReference, input: HotelSearchInput): Promise<HotelAvailability>`
   - `checkRate(rateKey: string): Promise<HotelRate>`
3. Mapear los DTOs de la API externa a los tipos del dominio Soleando.
4. Mantener las credenciales (API keys / secrets) en variables de entorno del servidor.
5. Registrar el nuevo proveedor en el switch de `getHotelProvider()`:
   ```ts
   case 'hotelbeds':
     return new HotelbedsProvider()
   ```
6. Ejecutar la suite de Contract Tests para verificar que el nuevo proveedor satisface el contrato.

---

## 7. Decision Gate — Preguntas Comerciales y Técnicas para el Cliente

Antes de iniciar la **Fase 6: Integración Sandbox del Proveedor**, el cliente debe responder las siguientes preguntas clave:

1. **Mayorista / Plataforma**: ¿Con qué consolidador o proveedor hotelero opera comercialmente Soleando (ej. Hotelbeds, Expedia Partner Solutions / Rapid, RateHawk, TravelgateX, Amadeus)?
2. **Contrato Comercial**: ¿Cuentan con un contrato de distribución B2B firmado y activo con dicho proveedor?
3. **Acceso API**: ¿El contrato incluye credenciales de acceso para integración vía API directa?
4. **Entorno Sandbox**: ¿Tienen acceso habilitado al ambiente de pruebas / Sandbox del proveedor?
5. **Credenciales Sandbox**: ¿Disponen de `ApiKey`, `SharedSecret` o `ClientCredentials` para realizar pruebas técnicas en desarrollo?
6. **Contenido de Propiedades**: ¿El proveedor ofrece API de contenido estático (fotos, descripciones, amenidades) o requiere mapeo contra un catálogo propio?
7. **Disponibilidad en Vivo**: ¿El proveedor ofrece búsqueda de tarifas y disponibilidad en tiempo real para República Dominicana y el Caribe?
8. **Checkout / Booking por API**: ¿El proveedor permite emitir reservas confirmadas mediante llamadas API transaccionales?
9. **Políticas de Cancelación**: ¿Cómo entrega el proveedor las reglas de cancelación (fechas límites, penalidades porcentuales, no reembolsable)?
10. **Proceso de Certificación**: ¿El proveedor exige un proceso formal de homologación o certificación técnica antes de otorgar credenciales de producción?
