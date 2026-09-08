import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 5,
    })
  : null

pool?.on('error', (error) => {
  console.error('[Database] Unexpected pool error:', error)
})

export const db = pool ? drizzle(pool, { schema }) : null

export function requireDatabase() {
  if (!db) {
    throw new Error('DATABASE_URL is required for this operation')
  }
  return db
}
