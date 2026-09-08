import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { pool } from '@/lib/db'

const originValues = [process.env.V0_RUNTIME_URL, process.env.V0_DEV_APP_URL, process.env.V0_BUILD_URL, process.env.V0_SANDBOX_URL].filter((v): v is string => Boolean(v))
const productionOrigins = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter((v): v is string => Boolean(v)).map((value) => value.startsWith('http') ? value : `https://${value}`)
const authSecret = process.env.BETTER_AUTH_SECRET

export const isAuthConfigured = Boolean(pool && authSecret)

export const auth = pool && authSecret
  ? betterAuth({
      database: pool,
      secret: authSecret,
      baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.V0_RUNTIME_URL || 'http://localhost:3000'),
      trustedOrigins: process.env.NODE_ENV === 'development' ? ['http://localhost:3000', ...originValues] : productionOrigins,
      emailAndPassword: {
        enabled: true,
        disableSignUp: true,
      },
      plugins: [admin()],
    })
  : null
