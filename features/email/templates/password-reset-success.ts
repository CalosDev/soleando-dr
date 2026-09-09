import { renderBaseEmailLayout } from './base-layout'
import type { RenderedEmail } from './verify-email'

export interface PasswordResetSuccessTemplateInput {
  name?: string
  loginUrl: string
}

export function renderPasswordResetSuccessTemplate({
  name,
  loginUrl,
}: PasswordResetSuccessTemplateInput): RenderedEmail {
  const greeting = name ? `Hola ${name},` : '¡Hola!'
  const subject = 'Tu contraseña ha sido actualizada — Soleando DR'

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; font-size: 24px; color: #1c1917; margin: 0 0 16px 0; font-weight: normal;">
      Contraseña actualizada
    </h2>
    <p style="margin: 0 0 16px 0;">
      ${greeting} Te confirmamos que la contraseña de tu cuenta en <strong>Soleando DR</strong> ha sido actualizada exitosamente.
    </p>
    <p style="margin: 0 0 24px 0;">
      Ya puedes iniciar sesión con tu nueva contraseña. Por razones de seguridad, cualquier otra sesión abierta en otros dispositivos ha sido cerrada.
    </p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${loginUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1c1917; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 9999px;">
        Iniciar sesión ahora
      </a>
    </div>

    <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 16px; margin: 24px 0; font-size: 13px; color: #991b1b;">
      <strong>¿No fuiste tú?</strong> Si tú no realizaste este cambio, por favor contacta de inmediato con nuestro equipo de soporte para proteger tu cuenta.
    </div>
  `

  const text = `${greeting}

Te confirmamos que la contraseña de tu cuenta en Soleando DR ha sido actualizada exitosamente.

Ya puedes iniciar sesión en:
${loginUrl}

Si no realizaste este cambio, por favor contacta a soporte inmediatamente.

Atentamente,
El equipo de Soleando DR`

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: 'Tu contraseña de Soleando DR ha sido actualizada exitosamente.',
    contentHtml,
  })

  return {
    subject,
    html,
    text,
  }
}
