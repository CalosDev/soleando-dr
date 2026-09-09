# Infraestructura de Email — Soleando DR (Fase 12A)

Este documento describe la arquitectura, componentes, configuración y políticas de entrega de correo transaccional de Soleando DR.

---

## 1. Principio de Desacoplamiento

El sistema de autenticación (Better Auth) y los servicios de negocio de Soleando **nunca se acoplan a un SDK de correo específico**. La interacción se realiza a través de la abstracción `EmailProvider`:

```text
Better Auth / Negocio
         │
         ▼
    EmailService
(Plantillas HTML + Texto)
         │
         ▼
   EmailProvider
(Contrato desacoplado)
         │
    ┌────┴────┐
    ▼         ▼
DevProvider  ResendProvider
 (Local)     (Producción)
```

---

## 2. Contrato `EmailProvider`

Definido en `features/email/providers/email-provider.ts`:

```typescript
export interface EmailProvider {
  readonly providerId: string
  send(input: SendEmailInput): Promise<SendEmailResult>
}
```

### `SendEmailInput`
- `to`: Destinatario (string o array).
- `from`: Remitente oficial (ej. `Soleando DR <noreply@soleando.com.do>`).
- `replyTo`: Dirección de respuesta (ej. `contacto@soleando.com.do`).
- `subject`: Asunto del correo.
- `html`: Versión HTML optimizada para clientes de correo.
- `text`: Versión en texto plano obligatoria.
- `tag`: Etiqueta de clasificación (ej. `auth-verification`, `auth-password-reset`).

---

## 3. Production Guard (Fail-Closed)

Implementado en `features/email/providers/get-email-provider.ts`:
- Si `NODE_ENV === 'production'`, el proveedor `dev` está **estrictamente prohibido**.
- Si falta `RESEND_API_KEY` o el proveedor solicitado no es válido en producción, el factory lanza `EmailConfigurationError` inmediatamente.
- Esto garantiza que nunca se silencien correos ni se use un emulador en un entorno productivo real.

---

## 4. Plantillas Transaccionales

Todas las plantillas residen en `features/email/templates/`:
- **`base-layout.ts`**: Maquetación responsive con la identidad de Soleando (`#1c1917`, `#f64d0b`, `#fdfbf7`), sin dependencias de JavaScript del lado del cliente de correo.
- **`verify-email.ts`**: Verificación de cuenta nueva o reenvío manual.
- **`reset-password.ts`**: Enlace seguro para cambio de contraseña con advertencia de caducidad (1 hora).
- **`password-reset-success.ts`**: Confirmación de contraseña actualizada con aviso de seguridad.

Cada plantilla genera tanto **HTML estilizado** como **Plain Text**.

---

## 5. Variables de Entorno

| Variable | Descripción | Entornos | Ejemplo |
|---|---|---|---|
| `EMAIL_PROVIDER` | Adaptador activo (`dev` o `resend`) | Dev / Prod | `resend` |
| `RESEND_API_KEY` | API Key secreta del proveedor Resend | Server-only | `re_123456789...` |
| `EMAIL_FROM` | Dirección y nombre del remitente | Todos | `Soleando DR <noreply@soleando.com.do>` |
| `EMAIL_REPLY_TO` | Dirección de atención al cliente | Todos | `contacto@soleando.com.do` |

> [!CAUTION]
> **Protección de Secretos**:
> `RESEND_API_KEY` **nunca** debe llevar el prefijo `NEXT_PUBLIC_`. Es exclusivamente para uso del servidor.

---

## 6. Configuración de Dominio (SPF, DKIM, DMARC)

Antes de pasar a producción con envíos masivos o dominio propio:
1. **SPF (Sender Policy Framework)**:
   Añadir el registro `TXT` proporcionado por el proveedor (ej. `v=spf1 include:resend.com ~all`) en el DNS de `soleando.com.do`.
2. **DKIM (DomainKeys Identified Mail)**:
   Crear los registros `CNAME` o `TXT` de firmas criptográficas provistos por Resend para validar la autenticidad del remitente.
3. **DMARC (Domain-based Message Authentication)**:
   Configurar registro `TXT` en `_dmarc.soleando.com.do`:
   `v=DMARC1; p=quarantine; rua=mailto:dmarc@soleando.com.do; pct=100;`

---

## 7. Políticas de Seguridad y Anti-Abuso

1. **Anti-Enumeración de Usuarios**:
   - En `/recuperar-contrasena`, el sistema siempre responde con un mensaje neutral (*"Si existe una cuenta asociada a este correo, te hemos enviado las instrucciones"*), evitando revelar si un email está o no registrado.
2. **Expiración de Tokens**:
   - Los tokens de verificación y reset tienen un TTL de 1 hora administrado de forma nativa por la tabla `verification` de Better Auth.
3. **Revocación de Sesiones**:
   - Al restablecer una contraseña exitosamente, `revokeSessionsOnPasswordReset: true` invalida todas las sesiones activas en otros navegadores o dispositivos.
4. **Cooldown de Reenvío**:
   - La interfaz de usuario en `/verificar-email` impone un temporizador de 60 segundos antes de permitir un nuevo envío para mitigar spam o sobrecostos de API.
5. **Noindex en Rutas de Autenticación**:
   - `/verificar-email`, `/email-verificado`, `/recuperar-contrasena` y `/restablecer-contrasena` incluyen `robots: { index: false, follow: false }`.
