/**
 * Soleando DR — Email Domain Types
 * Desacoplados de cualquier proveedor externo (Resend, Postmark, etc.)
 */

export interface EmailRecipient {
  email: string
  name?: string
}

export interface SendEmailInput {
  to: string | string[]
  from?: string
  replyTo?: string
  subject: string
  html: string
  text: string
  tag?: string
}

export interface SendEmailResult {
  provider: string
  messageId?: string
  accepted: boolean
  timestamp: string
}
