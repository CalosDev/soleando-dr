import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { Pool } from 'pg'

import { CRUISES_DATA } from '../data/cruises'
import { POPULAR_DESTINATIONS } from '../data/destinations'
import { EXPERIENCES_DATA } from '../data/experiences'
import { MOCK_HOTELS } from '../data/mock-hotels'

type CatalogKind = 'destination' | 'hotel' | 'tour' | 'excursion_national' | 'excursion_international' | 'cruise'

function loadLocalEnvironment(): void {
  const envPath = resolve(process.cwd(), '.env.local')

  try {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?(.*?)["']?\s*$/)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2]
      }
    }
  } catch {
    // CI and deployment environments provide variables directly.
  }
}

loadLocalEnvironment()

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL es obligatoria para sincronizar el catálogo.')
}

type CatalogPayload = { id: string; slug?: string }

const entries: Array<{ kind: CatalogKind; item: CatalogPayload; sortOrder: number }> = [
  ...POPULAR_DESTINATIONS.map((item, sortOrder) => ({ kind: 'destination' as const, item, sortOrder })),
  ...EXPERIENCES_DATA.map((item, sortOrder) => ({ kind: 'excursion_national' as const, item, sortOrder })),
  ...CRUISES_DATA.map((item, sortOrder) => ({ kind: 'cruise' as const, item, sortOrder })),
  ...MOCK_HOTELS.map((item, sortOrder) => ({ kind: 'hotel' as const, item, sortOrder })),
]

async function main(): Promise<void> {
  const pool = new Pool({ connectionString: databaseUrl, max: 1 })

  try {
    await pool.query('begin')

    for (const { kind, item, sortOrder } of entries) {
      const id = item.id
      const slug = typeof item.slug === 'string' ? item.slug : id

      await pool.query(
        `insert into public.catalog_items (id, kind, slug, content, status, sort_order)
         values ($1, $2, $3, $4::jsonb, 'published', $5)
         on conflict (kind, slug) do nothing`,
        [id, kind, slug, JSON.stringify(item), sortOrder],
      )
    }

    await pool.query('commit')
    console.log(`Catálogo inicial verificado: ${entries.length} registros. Los existentes no se modificaron.`)
  } catch (error) {
    await pool.query('rollback')
    throw error
  } finally {
    await pool.end()
  }
}

void main()
