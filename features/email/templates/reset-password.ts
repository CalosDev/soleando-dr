import { renderBaseEmailLayout } from './base-layout'
import type { RenderedEmail } from './verify-email'

export interface ResetPasswordTemplateInput {
  name?: string
  resetUrl: string
}

export function renderResetPasswordTemplate({
  name,
  resetUrl,
}: ResetPasswordTemplateInput): RenderedEmail {
  const greeting = name ? `Hola ${name},` : '¡Hola!'
  const subject = 'Restablecimiento de contraseña — Soleando DR'

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; font-size: 24px; color: #1c1917; margin: 0 0 16px 0; font-weight: normal;">
      Recuperación de contraseña
    </h2>
    <p style="margin: 0 0 16px 0;">
      ${greeting} Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>Soleando DR</strong>.
    </p>
    <p style="margin: 0 0 16px 0;">
      Para crear una nueva contraseña, haz clic en el siguiente botón:
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #f64d0b; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 2px 6px rgba(246, 77, 11, 0.3);">
        Restablecer contraseña
      </a>
    </div>

    <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 12px; padding: 16px; margin: 24px 0; font-size: 13px; color: #854d0e;">
      <strong>Nota de seguridad:</strong> Este enlace expirará en 1 hora por tu protección. Si no realizaste esta solicitud, puedes ignorar este mensaje; tu contraseña actual permanecerá segura e inalterada.
    </div>

    <p style="font-size: 13px; color: #78716c; margin: 24px 0 0 0; line-height: 1.5; border-top: 1px solid #f5f1ea; padding-top: 16px;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
      <a href="${resetUrl}" style="color: #f64d0b; word-break: break-all;">${resetUrl}</a>
    </p>
  `

  const text = `${greeting}

Recibimos una solicitud para restablecer la contraseña de tu cuenta en Soleando DR.

Para elegir una nueva contraseña, abre el siguiente enlace en tu navegador (válido por 1 hora):
${resetUrl}

Si no solicitaste este cambio, puedes ignorar este correo de forma segura.

Atentamente,
El equipo de Soleando DR`

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: 'Solicitud para restablecer tu contraseña en Soleando DR.',
    contentHtml,
  })

  return {
    subject,
    html,
    text,
  }
}
