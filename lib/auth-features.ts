import 'server-only'

function hasValue(value: string | undefined): boolean {
  return Boolean(value?.trim())
}

/**
 * Safe feature flags derived from server-only credentials.
 * Only booleans cross the Server Component boundary; OAuth secrets never do.
 */
export function getAuthFeatures() {
  const isProduction = process.env.NODE_ENV === 'production'
  const emailProvider = process.env.EMAIL_PROVIDER?.trim().toLowerCase()

  return {
    googleSignInEnabled: hasValue(process.env.GOOGLE_CLIENT_ID) && hasValue(process.env.GOOGLE_CLIENT_SECRET),
    emailRegistrationEnabled:
      !isProduction || (emailProvider === 'resend' && hasValue(process.env.RESEND_API_KEY)),
  }
}
