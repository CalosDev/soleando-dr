import type { SendEmailInput, SendEmailResult } from '../domain/types'

export interface EmailProvider {
  readonly providerId: string
  send(input: SendEmailInput): Promise<SendEmailResult>
}
