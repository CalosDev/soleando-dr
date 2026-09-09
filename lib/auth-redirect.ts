/** Restricts post-auth navigation to a path on this application. */
export function getSafeRedirectPath(value: string | null | undefined, fallback = '/cuenta') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback
  return value
}

