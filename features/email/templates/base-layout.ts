export interface BaseEmailLayoutOptions {
  title: string
  preheader?: string
  contentHtml: string
}

/**
 * Maquetación HTML base compatible con los principales clientes de correo
 * Sin dependencias de JavaScript en el cliente de correo, estilos inline robustos.
 */
export function renderBaseEmailLayout({
  title,
  preheader = '',
  contentHtml,
}: BaseEmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #fdfbf7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .email-container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ede8e1; }
    .header { background-color: #1c1917; padding: 32px 24px; text-align: center; }
    .logo-text { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; margin: 0; }
    .logo-subtext { color: #fadc40; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }
    .content { padding: 40px 32px; color: #292524; font-size: 15px; line-height: 1.6; }
    .btn { display: inline-block; background-color: #f64d0b; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 9999px; text-align: center; margin: 24px 0; }
    .footer { background-color: #faf7f2; padding: 24px 32px; text-align: center; font-size: 12px; color: #78716c; border-top: 1px solid #ede8e1; }
    .footer a { color: #f64d0b; text-decoration: underline; }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #fdfbf7;">
  <!-- Preheader oculto para preview de bandeja de entrada -->
  <div style="display: none; font-size: 1px; color: #fdfbf7; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fdfbf7;">
    <tr>
      <td align="center" style="padding: 16px;">
        <div class="email-container" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ede8e1; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          
          <!-- Encabezado con Identidad Soleando -->
          <div class="header" style="background-color: #1c1917; padding: 32px 24px; text-align: center;">
            <p class="logo-text" style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; font-family: Georgia, serif;">
              SOLEANDO<span style="color: #f64d0b;">.</span>
            </p>
            <p class="logo-subtext" style="color: #fadc40; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 4px 0 0 0;">
              República Dominicana
            </p>
          </div>

          <!-- Contenido Principal -->
          <div class="content" style="padding: 36px 32px; color: #292524; font-size: 15px; line-height: 1.6;">
            ${contentHtml}
          </div>

          <!-- Pie de Correo y Seguridad -->
          <div class="footer" style="background-color: #faf7f2; padding: 24px 32px; text-align: center; font-size: 12px; color: #78716c; border-top: 1px solid #ede8e1;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #44403c;">
              Soleando DR — Agencia de Viajes y Turismo
            </p>
            <p style="margin: 0 0 12px 0;">
              Santo Domingo & Punta Cana, República Dominicana.
            </p>
            <p style="margin: 0; font-size: 11px; color: #a8a29e;">
              Este es un correo transaccional generado automáticamente para tu seguridad. Por favor no respondas directamente a este mensaje.
            </p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`
}
