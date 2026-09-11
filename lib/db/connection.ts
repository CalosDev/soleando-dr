import 'server-only'

import type { PoolConfig } from 'pg'

/**
 * Keeps Neon connections on pg's strict TLS mode. `sslmode=require` is
 * currently accepted by pg, but will have weaker semantics in pg 9.
 */
export function getDatabaseConnectionConfig(databaseUrl: string): PoolConfig {
  const url = new URL(databaseUrl)

  if (url.hostname.endsWith('.neon.tech') && url.searchParams.get('sslmode') === 'require') {
    url.searchParams.set('sslmode', 'verify-full')
  }

  return { connectionString: url.toString() }
}
