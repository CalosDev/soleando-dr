import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import net from 'node:net'
import test, { after, before } from 'node:test'

let server
let baseUrl

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const listener = net.createServer()
    listener.once('error', reject)
    listener.listen(0, '127.0.0.1', () => {
      const address = listener.address()
      listener.close((error) => (error ? reject(error) : resolve(address.port)))
    })
  })
}

async function waitForServer(url, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${url}/api/auth/get-session`)
      if (response.ok) return
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  throw new Error('El servidor de pruebas no inició a tiempo.')
}

before(async () => {
  const port = await getAvailablePort()
  baseUrl = `http://127.0.0.1:${port}`
  const environment = {
    ...process.env,
    BETTER_AUTH_SECRET: 'test-secret-not-for-production-1234567890',
    BETTER_AUTH_URL: baseUrl,
    DATABASE_URL: '',
    SUPABASE_URL: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
  }

  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
    cwd: process.cwd(),
    env: environment,
    stdio: ['ignore', 'ignore', 'pipe'],
  })

  let startupError = ''
  server.stderr.on('data', (chunk) => {
    startupError += chunk.toString()
  })
  server.once('exit', (code) => {
    if (code && startupError) console.error(startupError)
  })

  await waitForServer(baseUrl)
})

after(async () => {
  if (!server || server.exitCode !== null) return

  server.kill()
  await new Promise((resolve) => server.once('exit', resolve))
})

test('customer and admin routes preserve separate unauthenticated redirects', async () => {
  const [customerResponse, adminResponse] = await Promise.all([
    fetch(`${baseUrl}/cuenta`, { redirect: 'manual' }),
    fetch(`${baseUrl}/admin`, { redirect: 'manual' }),
  ])

  // Server Component redirects are serialized into the HTML stream for browser navigation.
  assert.equal(customerResponse.status, 200)
  assert.match(await customerResponse.text(), /\/login\?next=%2Fcuenta/)
  assert.equal(adminResponse.status, 200)
  assert.match(await adminResponse.text(), /\/admin\/login\?next=%2Fadmin/)
})

test('authentication and upload routes fail safely without configured services', async () => {
  const sessionResponse = await fetch(`${baseUrl}/api/auth/get-session`)
  assert.equal(sessionResponse.status, 200)
  assert.equal(await sessionResponse.json(), null)

  const form = new FormData()
  form.set('file', new Blob([new Uint8Array([0xff, 0xd8, 0xff])], { type: 'image/jpeg' }), 'photo.jpg')
  const uploadResponse = await fetch(`${baseUrl}/api/upload`, { method: 'POST', body: form })

  assert.equal(uploadResponse.status, 401)
  assert.deepEqual(await uploadResponse.json(), {
    error: 'No autorizado. Se requieren permisos de administrador.',
  })
})
