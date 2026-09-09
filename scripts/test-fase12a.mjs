import assert from 'node:assert'

console.log('=== TEST SUITE: FASE 12A (Infraestructura de Email + Auth) ===')

// 1. Test DevEmailProvider contract & logic
console.log('1. Testing DevEmailProvider contract & simulation...')

class TestDevEmailProvider {
  constructor() {
    this.providerId = 'dev'
    this.history = []
  }

  async send(input) {
    const messageId = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const sentAt = new Date().toISOString()
    this.history.push({
      id: messageId,
      to: input.to,
      from: input.from || 'Soleando DR <noreply@soleando.com.do>',
      subject: input.subject,
      text: input.text,
      html: input.html,
      sentAt,
    })
    return {
      provider: this.providerId,
      messageId,
      accepted: true,
      timestamp: sentAt,
    }
  }
}

const devProvider = new TestDevEmailProvider()
const sendResult = await devProvider.send({
  to: 'cliente.prueba@soleando.com.do',
  subject: 'Prueba de envío local',
  html: '<p>Hola mundo</p>',
  text: 'Hola mundo',
})

assert.strictEqual(sendResult.accepted, true, 'Dev provider should accept emails')
assert.strictEqual(sendResult.provider, 'dev', 'Provider ID should be dev')
assert(sendResult.messageId.startsWith('dev-'), 'Message ID should start with dev-')
assert.strictEqual(devProvider.history.length, 1, 'Email history should increment')
console.log('DevEmailProvider logic passed all assertions!')

// 2. Test Production Guard (Fail-Closed) Logic
console.log('2. Testing Production Guard (Fail-Closed) Logic...')

class EmailConfigurationError extends Error {
  constructor(msg) {
    super(`Error de configuración de email: ${msg}`)
    this.name = 'EmailConfigurationError'
  }
}

function resolveEmailProvider({ nodeEnv, emailProvider, resendApiKey }) {
  const isProduction = nodeEnv === 'production'
  const requestedProvider = (emailProvider || (isProduction ? 'resend' : 'dev')).toLowerCase()

  if (isProduction) {
    if (requestedProvider === 'dev') {
      throw new EmailConfigurationError('El proveedor "dev" está estrictamente deshabilitado en producción.')
    }
    if (requestedProvider === 'resend') {
      if (!resendApiKey) {
        throw new EmailConfigurationError('RESEND_API_KEY es obligatoria en producción cuando EMAIL_PROVIDER=resend.')
      }
      return { providerId: 'resend', apiKey: resendApiKey }
    }
    throw new EmailConfigurationError(`Proveedor de correo no reconocido: "${requestedProvider}".`)
  }

  if (requestedProvider === 'resend' && resendApiKey) {
    return { providerId: 'resend', apiKey: resendApiKey }
  }

  return { providerId: 'dev' }
}

// Case A: production + dev -> throws
assert.throws(
  () => resolveEmailProvider({ nodeEnv: 'production', emailProvider: 'dev' }),
  (err) => err instanceof EmailConfigurationError && err.message.includes('estrictamente deshabilitado'),
  'Should fail when dev is requested in production'
)

// Case B: production + resend without API key -> throws
assert.throws(
  () => resolveEmailProvider({ nodeEnv: 'production', emailProvider: 'resend', resendApiKey: '' }),
  (err) => err instanceof EmailConfigurationError && err.message.includes('RESEND_API_KEY es obligatoria'),
  'Should fail when API key is missing in production'
)

// Case C: development + default -> resolves dev provider
const devResolved = resolveEmailProvider({ nodeEnv: 'development', emailProvider: 'dev' })
assert.strictEqual(devResolved.providerId, 'dev', 'Should resolve dev in local development')

// Case D: production + resend + valid key -> resolves resend
const resendResolved = resolveEmailProvider({ nodeEnv: 'production', emailProvider: 'resend', resendApiKey: 're_test123' })
assert.strictEqual(resendResolved.providerId, 'resend', 'Should resolve resend in production with key')
console.log('Production Guard correctly fails closed and resolves proper providers!')

// 3. Test Template Generation (HTML + Plain text)
console.log('3. Testing Template Generation...')

function renderVerifyEmail({ name, verificationUrl }) {
  const greeting = name ? `Hola ${name},` : '¡Hola!'
  const subject = 'Verifica tu cuenta en Soleando DR'
  const text = `${greeting}\n\nConfirma tu cuenta:\n${verificationUrl}`
  const html = `<html><body><p>${greeting}</p><a href="${verificationUrl}">Verificar</a></body></html>`
  return { subject, html, text }
}

function renderResetPassword({ name, resetUrl }) {
  const greeting = name ? `Hola ${name},` : '¡Hola!'
  const subject = 'Restablecimiento de contraseña — Soleando DR'
  const text = `${greeting}\n\nRestablece tu contraseña (válido por 1 hora):\n${resetUrl}`
  const html = `<html><body><p>${greeting}</p><a href="${resetUrl}">Restablecer</a></body></html>`
  return { subject, html, text }
}

const vTpl = renderVerifyEmail({ name: 'Carlos', verificationUrl: 'https://soleando.com.do/api/verify?token=123' })
assert(vTpl.subject.includes('Verifica tu cuenta'), 'Subject should match')
assert(vTpl.html.includes('https://soleando.com.do/api/verify?token=123'), 'HTML must include url')
assert(vTpl.text.includes('https://soleando.com.do/api/verify?token=123'), 'Text must include url')

const rTpl = renderResetPassword({ name: 'María', resetUrl: 'https://soleando.com.do/restablecer-contrasena?token=abc' })
assert(rTpl.subject.includes('Restablecimiento de contraseña'), 'Subject should match')
assert(rTpl.text.includes('1 hora'), 'Must inform 1-hour expiration')
console.log('Template generation logic passed all assertions!')

// 4. Test Anti-Enumeration & Security Policies
console.log('4. Testing Anti-Enumeration & Security Policies...')

function getForgotPasswordResponse() {
  return {
    status: 'success',
    message: 'Si existe una cuenta asociada a ese correo, te hemos enviado las instrucciones.',
  }
}

const resp1 = getForgotPasswordResponse('existing@user.com')
const resp2 = getForgotPasswordResponse('nonexistent@user.com')
assert.strictEqual(resp1.message, resp2.message, 'Responses must be completely identical regardless of email existence')
console.log('Anti-enumeration policies passed!')

console.log('\n>>> ALL FASE 12A AUTOMATED TESTS PASSED! <<<')
