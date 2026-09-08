import { randomBytes, randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { hashPassword } from 'better-auth/crypto'
import pg from 'pg'

const { Pool } = pg
const generateCredentials = process.argv.includes('--generate')
const databaseUrl = process.env.DATABASE_URL
const email = generateCredentials
  ? 'admin@soleando.local'
  : process.env.SOLEANDO_ADMIN_EMAIL?.trim().toLowerCase()
const name = generateCredentials
  ? 'Administrador'
  : process.env.SOLEANDO_ADMIN_NAME?.trim()
const password = generateCredentials
  ? `${randomBytes(24).toString('base64url')}Aa1!`
  : process.env.SOLEANDO_ADMIN_PASSWORD

async function removeBootstrapVariables() {
  const envPath = new URL('../.env.local', import.meta.url)
  const contents = await readFile(envPath, 'utf8')
  const cleaned = contents.replace(/^SOLEANDO_ADMIN_(?:EMAIL|NAME|PASSWORD)=.*(?:\r?\n|$)/gm, '')
  await writeFile(envPath, cleaned, { encoding: 'utf8', mode: 0o600 })
}

if (!databaseUrl || !email || !name || !password) {
  console.error('Define DATABASE_URL, SOLEANDO_ADMIN_EMAIL, SOLEANDO_ADMIN_NAME y SOLEANDO_ADMIN_PASSWORD.')
  process.exit(1)
}

if (!/^\S+@\S+\.\S+$/.test(email)) {
  console.error('SOLEANDO_ADMIN_EMAIL no es un correo válido.')
  process.exit(1)
}

if (email.endsWith('@example.com') || /^replace-|^change-|^your-/i.test(password)) {
  console.error('Reemplaza las credenciales de ejemplo antes de crear el administrador.')
  process.exit(1)
}

if (password.length < 12 || password.length > 128) {
  console.error('SOLEANDO_ADMIN_PASSWORD debe tener entre 12 y 128 caracteres.')
  process.exit(1)
}

const pool = new Pool({ connectionString: databaseUrl, max: 1 })
const client = await pool.connect()

try {
  await client.query('begin')

  const existingAdmin = await client.query(
    'select 1 from public."user" where "role" = $1 limit 1',
    ['admin'],
  )
  if (existingAdmin.rowCount) {
    throw new Error('Ya existe un administrador. El bootstrap inicial fue cancelado.')
  }

  const existingEmail = await client.query(
    'select 1 from public."user" where lower("email") = $1 limit 1',
    [email],
  )
  if (existingEmail.rowCount) {
    throw new Error('Ya existe un usuario con ese correo.')
  }

  const userId = randomUUID()
  const now = new Date()
  const passwordHash = await hashPassword(password)

  await client.query(
    `insert into public."user"
      ("id", "name", "email", "emailVerified", "role", "banned", "createdAt", "updatedAt")
     values ($1, $2, $3, true, 'admin', false, $4, $4)`,
    [userId, name, email, now],
  )
  await client.query(
    `insert into public."account"
      ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
     values ($1, $2, 'credential', $2, $3, $4, $4)`,
    [randomUUID(), userId, passwordHash, now],
  )

  await client.query('commit')
  console.log(`Administrador inicial creado: ${email}`)
  if (generateCredentials) {
    console.log(`Contraseña generada (guárdala ahora): ${password}`)
  }

  try {
    await removeBootstrapVariables()
    console.log('Variables temporales SOLEANDO_ADMIN_* eliminadas de .env.local.')
  } catch {
    console.error('El administrador fue creado, pero debes eliminar manualmente SOLEANDO_ADMIN_* de .env.local.')
    process.exitCode = 1
  }
} catch (error) {
  await client.query('rollback')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
