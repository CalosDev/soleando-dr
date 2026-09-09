import 'server-only'

import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { Pool } from 'pg'

import { sendVerificationEmail } from '@/features/email/services/send-verification-email'
import { sendPasswordResetEmail } from '@/features/email/services/send-password-reset-email'

const originValues = [process.env.V0_RUNTIME_URL, process.env.V0_DEV_APP_URL, process.env.V0_BUILD_URL, process.env.V0_SANDBOX_URL].filter((v): v is string => Boolean(v))
const productionOrigins = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter((v): v is string => Boolean(v)).map((value) => value.startsWith('http') ? value : `https://${value}`)
const authSecret = process.env.BETTER_AUTH_SECRET

const databaseUrl = process.env.DATABASE_URL
const appBaseUrl = process.env.BETTER_AUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.V0_RUNTIME_URL || 'http://localhost:3000')

const trustedOrigins = Array.from(
  new Set([
    'http://localhost:3000',
    appBaseUrl,
    ...(process.env.NODE_ENV === 'development' ? originValues : productionOrigins),
  ])
)

export const auth = databaseUrl
  ? betterAuth({
      database: new Pool({ connectionString: databaseUrl }),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: appBaseUrl,
      trustedOrigins,
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({ user, url }) => {
          await sendPasswordResetEmail({
            to: user.email,
            name: user.name,
            resetUrl: url,
          })
        },
      },
      emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
          // Asegurar redirección al destino oficial tras verificar
          const verificationUrl = url.includes('callbackURL=')
            ? url
            : `${url}${url.includes('?') ? '&' : '?'}callbackURL=${encodeURIComponent('/email-verificado')}`

          await sendVerificationEmail({
            to: user.email,
            name: user.name,
            verificationUrl,
          })
        },
      },
      plugins: [
        admin({
          defaultRole: 'user',
        }),
      ],
      ...(process.env.NODE_ENV === 'development' ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } } : {}),
    })
  : null

