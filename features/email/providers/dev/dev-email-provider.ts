import type { EmailProvider } from '../email-provider'
import type { SendEmailInput, SendEmailResult } from '../../domain/types'

export interface DevEmailLogEntry {
  id: string
  to: string | string[]
  from: string
  subject: string
  text: string
  html: string
  sentAt: string
}

// In-memory log for local testing / unit tests
export const devEmailHistory: DevEmailLogEntry[] = []

export class DevEmailProvider implements EmailProvider {
  public readonly providerId = 'dev'

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const messageId = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const sentAt = new Date().toISOString()

    const logEntry: DevEmailLogEntry = {
      id: messageId,
      to: input.to,
      from: input.from || 'Soleando DR <noreply@soleando.com.do>',
      subject: input.subject,
      text: input.text,
      html: input.html,
      sentAt,
    }

    devEmailHistory.push(logEntry)

    // Redacted console output for local debugging
    const recipient = Array.isArray(input.to) ? input.to.join(', ') : input.to
    console.log(`[DevEmailProvider] ✉️ Email simulado enviado a: ${recipient} | Asunto: "${input.subject}" | ID: ${messageId}`)

    return {
      provider: this.providerId,
      messageId,
      accepted: true,
      timestamp: sentAt,
    }
  }
}
