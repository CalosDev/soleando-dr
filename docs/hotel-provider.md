# Proveedor de hoteles

La interfaz pública nunca importa inventario directamente. El flujo es:

`UI -> servicios de hoteles -> HotelProvider -> proveedor configurado`.

`features/hotels/domain` contiene contratos normalizados: referencias externas, ocupación por habitación, dinero como texto decimal y tarifas con `rateKey` opaco. No existe ninguna operación de reserva o pago en esta fase.

## Configuración actual

`HOTEL_PROVIDER=mock` está permitido sólo en desarrollo y pruebas. Si la aplicación se ejecuta con `NODE_ENV=production`, el resolver usa un proveedor no disponible y la UI muestra una alternativa de contacto; nunca presenta los datos mock como disponibilidad real.

El mock es determinista y vive sólo en servidor. Sus escenarios de prueba (`default`, `empty`, `provider-error`, `rate-changed` y `rate-unavailable`) se seleccionan internamente al construir el proveedor; no se exponen por parámetros públicos.

## Añadir un proveedor real

1. Implementar `HotelProvider` en `features/hotels/providers/<nombre>`.
2. Mapear las respuestas externas a los tipos de dominio, preservando `reference.provider` y el identificador externo en `reference.id`.
3. Validar su contrato contra los mismos casos: resultados, vacío, error del proveedor, hotel inexistente, disponibilidad y cambio/no disponibilidad de tarifa.
4. Añadir credenciales sólo en variables de entorno server-side. No usar variables `NEXT_PUBLIC_*` ni importar el SDK en componentes.
5. Actualizar el resolver con el proveedor explícitamente soportado y probar el comportamiento de producción antes de activarlo.

La tarifa se trata como información de referencia hasta que exista una fase posterior que confirme reserva. Los importes usan `Money.amount` como string para no perder precisión; sólo se convierten para formato de presentación.
