import { getEmailProvider } from '../providers/get-email-provider'
import { renderResetPasswordTemplate } from '../templates/reset-password'
import type { SendEmailResult } from '../domain/types'

export interface SendPasswordResetEmailParams {
  to: string
  name?: string
  resetUrl: string
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<SendEmailResult> {
  const provider = getEmailProvider()
  const { subject, html, text } = renderResetPasswordTemplate({
    name,
    resetUrl,
  })

  return provider.send({
    to,
    subject,
    html,
    text,
    tag: 'auth-password-reset',
  })
}
