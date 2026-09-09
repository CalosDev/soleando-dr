import { Resend } from 'resend'
import type { EmailProvider } from '../email-provider'
import type { SendEmailInput, SendEmailResult } from '../../domain/types'
import { EmailProviderError, EmailConfigurationError } from '../../domain/errors'

export class ResendEmailProvider implements EmailProvider {
  public readonly providerId = 'resend'
  private resend: Resend
  private defaultFrom: string

  constructor(apiKey?: string, defaultFrom?: string) {
    const key = apiKey || process.env.RESEND_API_KEY
    if (!key) {
      throw new EmailConfigurationError('RESEND_API_KEY no está configurada en las variables de entorno.')
    }
    this.resend = new Resend(key)
    this.defaultFrom = defaultFrom || process.env.EMAIL_FROM || 'Soleando DR <noreply@soleando.com.do>'
  }

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    try {
      const from = input.from || this.defaultFrom
      const replyTo = input.replyTo || process.env.EMAIL_REPLY_TO || 'contacto@soleando.com.do'

      const response = await this.resend.emails.send({
        from,
        to: input.to,
        replyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
        tags: input.tag ? [{ name: 'category', value: input.tag }] : undefined,
      })

      if (response.error) {
        throw new EmailProviderError('resend', response.error.message)
      }

      return {
        provider: this.providerId,
        messageId: response.data?.id,
        accepted: true,
        timestamp: new Date().toISOString(),
      }
    } catch (err: unknown) {
      if (err instanceof EmailProviderError) {
        throw err
      }
      const msg = err instanceof Error ? err.message : 'Error inesperado al conectar con Resend'
      throw new EmailProviderError('resend', msg)
    }
  }
}
