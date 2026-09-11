import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { getDatabaseConnectionConfig } from './connection'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

export const pool = databaseUrl ? new Pool(getDatabaseConnectionConfig(databaseUrl)) : null
export const db = pool ? drizzle(pool, { schema }) : null
