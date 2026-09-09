import { renderBaseEmailLayout } from './base-layout'

export interface VerifyEmailTemplateInput {
  name?: string
  verificationUrl: string
}

export interface RenderedEmail {
  subject: string
  html: string
  text: string
}

export function renderVerifyEmailTemplate({
  name,
  verificationUrl,
}: VerifyEmailTemplateInput): RenderedEmail {
  const greeting = name ? `Hola ${name},` : '¡Hola!'
  const subject = 'Verifica tu cuenta en Soleando DR'

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; font-size: 24px; color: #1c1917; margin: 0 0 16px 0; font-weight: normal;">
      Confirma tu correo electrónico
    </h2>
    <p style="margin: 0 0 16px 0;">
      ${greeting} Gracias por unirte a <strong>Soleando DR</strong>. Para completar tu registro y acceder a la reserva de hoteles y excursiones, por favor confirma tu dirección de correo electrónico pulsando el botón a continuación:
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #f64d0b; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 2px 6px rgba(246, 77, 11, 0.3);">
        Verificar mi correo
      </a>
    </div>

    <p style="font-size: 13px; color: #78716c; margin: 24px 0 0 0; line-height: 1.5; border-top: 1px solid #f5f1ea; pt: 16px;">
      Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:<br>
      <a href="${verificationUrl}" style="color: #f64d0b; word-break: break-all;">${verificationUrl}</a>
    </p>

    <p style="font-size: 12px; color: #a8a29e; margin: 20px 0 0 0;">
      Si no creaste una cuenta en Soleando DR, puedes desestimar e ignorar este mensaje de forma segura.
    </p>
  `

  const text = `${greeting}

Gracias por registrarte en Soleando DR.

Para confirmar tu cuenta y habilitar tu acceso completo, por favor abre el siguiente enlace en tu navegador:
${verificationUrl}

Si no creaste una cuenta en Soleando DR, puedes ignorar este correo.

Atentamente,
El equipo de Soleando DR`

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: 'Confirma tu correo electrónico para activar tu cuenta en Soleando DR.',
    contentHtml,
  })

  return {
    subject,
    html,
    text,
  }
}
