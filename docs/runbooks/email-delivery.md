# Runbook: Resolución de Incidencias de Entrega de Email — Soleando DR

Este runbook describe las acciones operativas a seguir ante incidencias comunes con el servicio de correo transaccional.

---

## 1. El usuario no recibe el correo de verificación

### Síntomas:
- El cliente completó su registro en `/registro` pero indica no haber recibido el correo para verificar su cuenta.

### Diagnóstico:
1. **Revisar carpeta de Spam / Correo no deseado**: En un alto porcentaje de casos iniciales, filtros de proveedores como Outlook o Hotmail envían correos sin historial previo a la carpeta de no deseados.
2. **Revisar cooldown en `/verificar-email`**: Pedir al usuario que espere 60 segundos y use el botón *"Reenviar correo de verificación"*.
3. **Comprobar logs del servidor o dashboard de Resend**:
   - Verificar si el evento figura como `Delivered`, `Bounced` o `Suppressed`.
   - Si figura como `Suppressed`, el usuario puede haber marcado previamente un correo como spam o tener un buzón lleno/bloqueado.

---

## 2. Error: `EmailConfigurationError` en Producción

### Síntomas:
- El servidor arroja un error 500 al intentar enviar un correo en producción con el mensaje:
  `RESEND_API_KEY es obligatoria en producción cuando EMAIL_PROVIDER=resend.`

### Solución:
1. Ir a la consola del proveedor de hosting (ej. Vercel, VPS o Supabase).
2. Verificar que la variable `RESEND_API_KEY` esté definida en el entorno de Producción (Production Environment Variables).
3. Confirmar que `EMAIL_PROVIDER=resend`.
4. Disparar un redeploy para que el runtime cargue las credenciales actualizadas.

---

## 3. Enlace de restablecimiento o verificación inválido o expirado

### Síntomas:
- Al hacer clic en el botón del correo, la página muestra *"Enlace inválido o expirado"*.

### Diagnóstico y Solución:
1. Los enlaces generados por Better Auth tienen una vigencia predeterminada de **1 hora** por seguridad.
2. Si el usuario tardó más de 1 hora, debe solicitar un nuevo enlace desde `/recuperar-contrasena` o reenviar la verificación desde `/verificar-email`.
3. Si el enlace fue utilizado previamente, queda invalidado automáticamente (los tokens son de un solo uso).

---

## 4. Tasa de Rebote (Bounce Rate) Elevada

### Acciones preventivas:
1. Nunca comprar listas de correo ni enviar emails no solicitados usando el dominio transaccional de Soleando.
2. Mantener la validación estricta de formato de email en los formularios de registro.
3. Asegurarse de que los registros DNS (SPF, DKIM, DMARC) permanezcan en estado **Verified** en el panel de Resend.
