import { getEmailProvider } from '../providers/get-email-provider'
import { renderPasswordResetSuccessTemplate } from '../templates/password-reset-success'
import type { SendEmailResult } from '../domain/types'

export interface SendPasswordResetSuccessEmailParams {
  to: string
  name?: string
  loginUrl: string
}

export async function sendPasswordResetSuccessEmail({
  to,
  name,
  loginUrl,
}: SendPasswordResetSuccessEmailParams): Promise<SendEmailResult> {
  const provider = getEmailProvider()
  const { subject, html, text } = renderPasswordResetSuccessTemplate({
    name,
    loginUrl,
  })

  return provider.send({
    to,
    subject,
    html,
    text,
    tag: 'auth-password-reset-success',
  })
}
