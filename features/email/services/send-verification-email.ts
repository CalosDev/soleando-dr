import { getEmailProvider } from '../providers/get-email-provider'
import { renderVerifyEmailTemplate } from '../templates/verify-email'
import type { SendEmailResult } from '../domain/types'

export interface SendVerificationEmailParams {
  to: string
  name?: string
  verificationUrl: string
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: SendVerificationEmailParams): Promise<SendEmailResult> {
  const provider = getEmailProvider()
  const { subject, html, text } = renderVerifyEmailTemplate({
    name,
    verificationUrl,
  })

  return provider.send({
    to,
    subject,
    html,
    text,
    tag: 'auth-verification',
  })
}
