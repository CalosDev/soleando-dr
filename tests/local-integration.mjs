import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import net from 'node:net'
import { Pool } from 'pg'
import { hashPassword } from 'better-auth/crypto'

// Credentials are generated for this run. Never load .env files into the test runner.
const root = await mkdtemp(path.join(tmpdir(), 'soleando-integration-'))
const projectId = `soleando-test-${randomUUID().slice(0, 8)}`
let server
let pool
let stackStarted = false
const isolatedEnv = { ...process.env, DATABASE_URL: '', SUPABASE_URL: 'http://127.0.0.1:55321', SOLEANDO_LOCAL_INTEGRATION: '1', SUPABASE_SERVICE_ROLE_KEY: '',
  VERCEL: '', BETTER_AUTH_SECRET: randomUUID() + randomUUID(), GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '', RESEND_API_KEY: '' }

function command(binary, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    let errors = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { errors += chunk })
    child.once('error', reject)
    child.once('exit', (code) => code === 0 ? resolve(output) : reject(new Error(`${binary} failed (${code}): ${errors.slice(-3000)}`)))
  })
}

function supabase(args) {
  const params = ['--yes', 'supabase@2.117.0', ...args, '--workdir', root]
  return process.platform === 'win32'
    ? command('cmd.exe', ['/d', '/s', '/c', `npx --yes supabase@2.117.0 ${args.join(' ')} --workdir "${root}"`], { windowsVerbatimArguments: true })
    : command('npx', params)
}

function localUrl(value, protocol, port) {
  const url = new URL(value)
  assert.equal(url.hostname, '127.0.0.1', 'Only the isolated loopback stack is allowed')
  assert.equal(url.protocol, protocol)
  assert.equal(url.port, String(port))
  return value
}

try {
  await command('docker', ['info', '--format', '{{.ServerVersion}}'])
  for (const port of [55320, 55321, 55322, 55323, 55324, 55327, 55329, 55330, 8583]) {
    await new Promise((resolve, reject) => {
      const listener = net.createServer()
      listener.once('error', () => reject(new Error(`Port ${port} is occupied; leave the existing service untouched.`)))
      listener.listen(port, '127.0.0.1', () => listener.close(resolve))
    })
  }
  console.log('Building Next.js with external credentials disabled.')
  await command(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { env: isolatedEnv })
  await cp('supabase/migrations', path.join(root, 'supabase/migrations'), { recursive: true })
  const config = (await readFile('supabase/config.toml', 'utf8'))
    .replace(/^project_id = .*$/m, `project_id = "${projectId}"`)
    .replace(/5432([0-9])/g, '5532$1')
    .replace('inspector_port = 8083', 'inspector_port = 8583')
  await writeFile(path.join(root, 'supabase/config.toml'), config)
  // Only config and migrations are copied: remote link metadata is excluded.
  console.log('Starting isolated Supabase; first run may download Docker images.')
  stackStarted = true
  const heartbeat = setInterval(() => console.log('Supabase local startup in progress...'), 30_000)
  try {
    await supabase(['start', '--exclude', 'studio,postgres-meta,edge-runtime,logflare,vector,realtime,mailpit,imgproxy'])
  } finally { clearInterval(heartbeat) }
  const status = JSON.parse(await supabase(['status', '--output', 'json']))
  const databaseUrl = localUrl(status.DB_URL, 'postgresql:', 55322)
  const storageUrl = localUrl(status.API_URL, 'http:', 55321)
  const storageKey = status.SECRET_KEY || status.SERVICE_ROLE_KEY
  assert.ok(storageKey, `Supabase local secret key is missing (available fields: ${Object.keys(status).join(', ')})`)
  pool = new Pool({ connectionString: databaseUrl })

  const schema = await pool.query(`select relname from pg_class where relnamespace = 'public'::regnamespace
    and relrowsecurity and relname in ('user','session','account','verification','profiles','travelers','catalog_items')`)
  assert.equal(schema.rowCount, 7)
  const bucket = await pool.query("select public, file_size_limit from storage.buckets where id = 'soleando-media'")
  assert.equal(Number(bucket.rows[0].file_size_limit), 5242880)
  console.log('PASS: migrations, RLS and media bucket')

  const baseUrl = 'http://127.0.0.1:55330'
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '55330', '-H', '127.0.0.1'], {
    env: { ...isolatedEnv, DATABASE_URL: databaseUrl, BETTER_AUTH_URL: baseUrl,
      BETTER_AUTH_SECRET: randomUUID() + randomUUID(), SUPABASE_URL: storageUrl,
      SUPABASE_SERVICE_ROLE_KEY: storageKey, GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '',
      RESEND_API_KEY: '', EMAIL_PROVIDER: 'resend' },
    stdio: ['ignore', 'ignore', 'pipe'],
  })
  server.stderr.resume()
  for (let attempt = 0; ; attempt++) {
    try { if ((await fetch(`${baseUrl}/api/auth/get-session`)).ok) break } catch {}
    assert.ok(attempt < 100, 'Next server failed to start')
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  async function login(role) {
    const id = randomUUID()
    const email = `${id}@example.test`
    const password = randomUUID()
    await pool.query(`insert into public."user" (id,name,email,"emailVerified",role) values ($1,$2,$3,true,$4)`, [id, `Integration ${role}`, email, role])
    await pool.query(`insert into public.account (id,"accountId","providerId","userId",password) values ($1,$2,'credential',$2,$3)`, [randomUUID(), id, await hashPassword(password)])
    const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: baseUrl }, body: JSON.stringify({ email, password }),
    })
    assert.equal(response.status, 200, `Login ${role} failed: ${await response.clone().text()}`)
    const cookie = response.headers.getSetCookie().map((value) => value.split(';')[0]).join('; ')
    assert.ok(cookie.includes('session_token'))
    const session = await (await fetch(`${baseUrl}/api/auth/get-session`, { headers: { Cookie: cookie } })).json()
    assert.equal(session.user.id, id)
    assert.equal(session.user.role, role)
    return { cookie, id }
  }
  const customerSession = await login('user')
  const adminSession = await login('admin')
  const customer = customerSession.cookie
  const admin = adminSession.cookie
  console.log('PASS: real customer/admin password login and database sessions')
  await pool.query(`insert into profiles (user_id,first_name,last_name) values ($1,'Cliente','Prueba')`, [customerSession.id])
  await pool.query(`insert into travelers (id,user_id,first_name,last_name) values ($1,$2,'ViajeroPropio','Prueba'),($3,$4,'ViajeroPrivado','Prueba')`,
    [randomUUID(), customerSession.id, randomUUID(), adminSession.id])
  const profileResponse = await fetch(`${baseUrl}/cuenta/perfil`, { headers: { Cookie: customer } })
  assert.equal(profileResponse.status, 200)
  assert.match(await profileResponse.text(), /Cliente/)
  const travelersResponse = await fetch(`${baseUrl}/cuenta/viajeros`, { headers: { Cookie: customer } })
  assert.equal(travelersResponse.status, 200)
  const travelersHtml = await travelersResponse.text()
  assert.match(travelersHtml, /ViajeroPropio/)
  assert.doesNotMatch(travelersHtml, /ViajeroPrivado/)
  console.log('PASS: real profile retrieval and traveler ownership isolation')
  const forbidden = await fetch(`${baseUrl}/admin`, { headers: { Cookie: customer }, redirect: 'manual' })
  assert.match(await forbidden.text(), /\/admin\/login\?error=forbidden/)
  const allowed = await fetch(`${baseUrl}/admin`, { headers: { Cookie: admin }, redirect: 'manual' })
  assert.equal(allowed.status, 200)
  assert.doesNotMatch(await allowed.text(), /NEXT_REDIRECT/)
  console.log('PASS: customer denied admin access; administrator allowed')

  async function upload(cookie, bytes, mime) {
    const form = new FormData()
    form.set('file', new Blob([bytes], { type: mime }), 'integration.png')
    return fetch(`${baseUrl}/api/upload`, { method: 'POST', headers: { Cookie: cookie }, body: form })
  }
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aT4sAAAAASUVORK5CYII=', 'base64')
  assert.equal((await upload(customer, png, 'image/png')).status, 401)
  assert.equal((await upload(admin, Buffer.from('<script>alert(1)</script>'), 'image/png')).status, 400)
  assert.equal((await upload(admin, Buffer.alloc(0), 'image/png')).status, 400)
  assert.equal((await upload(admin, Buffer.alloc(5242881), 'image/png')).status, 400)
  const uploaded = await upload(admin, png, 'image/png')
  assert.equal(uploaded.status, 200, `Upload failed: ${await uploaded.clone().text()}`)
  const { url } = await uploaded.json()
  localUrl(url, 'http:', 55321)
  const image = await fetch(url)
  assert.equal(image.status, 200)
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), png)
  console.log('PASS: upload authorization, invalid/empty/oversized rejection and real Storage round trip')

  const optimized = await fetch(`${baseUrl}/_next/image?${new URLSearchParams({ url, w: '640', q: '75' })}`)
  assert.equal(optimized.status, 200, `Uploaded image optimization failed: ${await optimized.clone().text()}`)
  assert.match(optimized.headers.get('content-type'), /^image\//)
  const arbitraryImage = await fetch(`${baseUrl}/_next/image?${new URLSearchParams({ url: 'https://example.com/foreign.png', w: '640', q: '75' })}`)
  assert.equal(arbitraryImage.status, 400)
  console.log('PASS: real Next/Image optimization of Storage upload; arbitrary hosts blocked')

  function decode(value) {
    return value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  }
  async function submitCatalog(route, fields, cookie = admin, formIndex = 0) {
    const html = await (await fetch(`${baseUrl}${route}`, { headers: { Cookie: admin } })).text()
    const forms = html.match(/<form\b[^>]*>[\s\S]*?<\/form>/g) ?? []
    const form = new FormData()
    for (const tag of (forms[formIndex] ?? '').match(/<input\b[^>]*>/g) ?? []) {
      const name = tag.match(/name="([^"]+)"/)?.[1]
      if (name?.startsWith('$ACTION')) form.set(decode(name), decode(tag.match(/value="([^"]*)"/)?.[1] ?? ''))
    }
    assert.ok(Array.from(form.keys()).some((key) => key.startsWith('$ACTION_')), 'Native Server Action was not rendered')
    for (const [key, value] of Object.entries(fields)) form.set(key, value)
    return fetch(`${baseUrl}${route}`, { method: 'POST', headers: { Cookie: cookie, Origin: baseUrl }, body: form, redirect: 'manual' })
  }
  const fixture = { kind: 'excursion_national', title: 'Prueba aislada del catálogo', slug: `prueba-${randomUUID()}`, destination: 'Destino de prueba', category: 'Prueba', duration: '1 día', description: 'Contenido exclusivo de la prueba local automatizada.', priceFrom: '125', currency: 'DOP', image: url, status: 'draft', sortOrder: '0', gallery: url, included: 'Inclusión de prueba', notIncluded: 'Exclusión de prueba', recommendations: 'Recomendación de prueba', experienceItinerary: 'Día 1 | Etapa de prueba | Descripción de prueba', departures: 'Salida de prueba', groupType: 'Privado', difficulty: 'Moderada', priceRD: '125', badge: 'Prueba' }
  assert.equal((await submitCatalog('/admin/catalogo/nuevo', fixture)).status, 303)
  let row = (await pool.query('select * from catalog_items where slug=$1', [fixture.slug])).rows[0]
  assert.equal(row.status, 'draft')
  assert.equal(row.content.itinerary[0].title, 'Etapa de prueba')
  let detail = await (await fetch(`${baseUrl}/experiencias/${fixture.slug}`)).text()
  assert.doesNotMatch(detail, /Etapa de prueba/)
  const before = (await pool.query('select count(*) from catalog_items')).rows[0].count
  await submitCatalog('/admin/catalogo/nuevo', { ...fixture, slug: `denied-${randomUUID()}` }, customer)
  assert.equal((await pool.query('select count(*) from catalog_items')).rows[0].count, before)
  const duplicate = await submitCatalog('/admin/catalogo/nuevo', fixture)
  assert.match(await duplicate.text(), /Ya existe contenido/)
  const invalid = await submitCatalog('/admin/catalogo/nuevo', { ...fixture, currency: '123' })
  assert.match(await invalid.text(), /tres letras/)
  const editRoute = `/admin/catalogo/${row.id}/editar`
  assert.equal((await submitCatalog(editRoute, { ...fixture, status: 'published', badge: '' })).status, 303)
  detail = await (await fetch(`${baseUrl}/experiencias/${fixture.slug}`)).text()
  assert.match(detail, /Etapa de prueba/)
  assert.match(detail, /Salida de prueba/)
  assert.doesNotMatch(detail, /reseñas verificadas|Todos los días|Cancelación gratuita hasta 24h/)
  row = (await pool.query('select * from catalog_items where id=$1', [row.id])).rows[0]
  assert.equal(row.content.badge, undefined)
  await submitCatalog(editRoute, { ...fixture, status: 'draft' }, customer)
  assert.equal((await pool.query('select status from catalog_items where id=$1', [row.id])).rows[0].status, 'published')
  await submitCatalog('/admin', {}, customer)
  assert.equal((await pool.query('select status from catalog_items where id=$1', [row.id])).rows[0].status, 'published')
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text()
  assert.ok(sitemap.includes(`/experiencias/${fixture.slug}`))
  assert.equal((await submitCatalog('/admin', {})).status, 200)
  assert.equal((await pool.query('select status from catalog_items where id=$1', [row.id])).rows[0].status, 'archived')
  detail = await (await fetch(`${baseUrl}/experiencias/${fixture.slug}`)).text()
  assert.doesNotMatch(detail, /Etapa de prueba/)
  const cruise = { ...fixture, kind: 'cruise', slug: `cruise-${randomUUID()}`, status: 'published', line: 'Naviera de prueba', departurePort: 'Puerto de prueba', cruiseItinerary: 'Puerto A\nPuerto B\nPuerto A' }
  assert.equal((await submitCatalog('/admin/catalogo/nuevo', cruise)).status, 303)
  const cruiseRow = (await pool.query('select * from catalog_items where slug=$1', [cruise.slug])).rows[0]
  const cruiseHtml = await (await fetch(`${baseUrl}/cruceros/${cruiseRow.id}`)).text()
  assert.match(cruiseHtml, /Naviera de prueba/)
  assert.match(cruiseHtml, /Inclusión de prueba/)
  console.log('PASS: real catalog actions create/edit/publish/archive, draft visibility, customer denial, duplicates, validation, cruise fields and sitemap')
  const logout = await fetch(`${baseUrl}/api/auth/sign-out`, { method: 'POST', headers: { Cookie: customer, Origin: baseUrl, 'Content-Type': 'application/json' }, body: '{}' })
  assert.equal(logout.status, 200)
  assert.equal(await (await fetch(`${baseUrl}/api/auth/get-session`, { headers: { Cookie: customer } })).json(), null)
  console.log('PASS: logout revokes the database session')
  if (process.argv.includes('--visual')) {
    // Optional local-only browser handoff. Never output cookies or passwords.
    const stateFile = path.join(root, 'browser-state.json')
    await writeFile(stateFile, JSON.stringify({ cookies: admin.split('; ').map((entry) => {
      const separator = entry.indexOf('=')
      return { name: entry.slice(0, separator), value: entry.slice(separator + 1), domain: '127.0.0.1', path: '/', httpOnly: true, secure: false, sameSite: 'Lax' }
    }), origins: [] }))
    console.log(`Local browser QA state: ${stateFile}`)
    console.log(`QA routes: ${baseUrl}${editRoute}, ${baseUrl}/cruceros/${cruiseRow.id}`)
    console.log('The isolated server remains available for up to 3 minutes; create qa-complete in its temporary directory to finish early.')
    const deadline = Date.now() + 180_000
    while (Date.now() < deadline) {
      try { await readFile(path.join(root, 'qa-complete')); break } catch {}
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
} finally {
  if (server && server.exitCode === null) {
    const exited = new Promise((resolve) => server.once('exit', resolve))
    server.kill()
    await exited
  }
  if (pool) await pool.end()
  if (stackStarted) await supabase(['stop', '--project-id', projectId, '--no-backup'])
  assert.ok(root.startsWith(path.join(tmpdir(), 'soleando-integration-')))
  await rm(root, { recursive: true, force: true })
  console.log('Temporary Supabase containers, test data and files removed.')
}
