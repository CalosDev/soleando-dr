import assert from 'node:assert/strict'
import test from 'node:test'

const [{ getSafeRedirectPath, signInSchema, signUpSchema }, { profileSchema }, { travelerSchema }, { providerHotelSearchSchema }] =
  await Promise.all([
    import('../lib/validation/auth.ts'),
    import('../features/profile/schemas.ts'),
    import('../features/travelers/schemas.ts'),
    import('../features/hotels/schemas/provider-search.ts'),
  ])

function dateOffset(days) {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

test('getSafeRedirectPath only permits internal relative paths', () => {
  for (const unsafePath of [
    'https://evil.example.com',
    '//evil.example.com',
    '/\\evil.example.com',
    'javascript:alert(1)',
    '',
    null,
    undefined,
  ]) {
    assert.equal(getSafeRedirectPath(unsafePath), '/cuenta')
  }

  assert.equal(getSafeRedirectPath('/cuenta/perfil'), '/cuenta/perfil')
  assert.equal(getSafeRedirectPath(' /hoteles?destination=punta-cana '), '/hoteles?destination=punta-cana')
  assert.equal(getSafeRedirectPath('/experiencias#detalles'), '/experiencias#detalles')
})

test('authentication schemas normalize valid input and reject invalid credentials', () => {
  const signIn = signInSchema.safeParse({ email: ' cliente@soleando.do ', password: 'secret' })
  assert.equal(signIn.success, true)
  assert.equal(signIn.data.email, 'cliente@soleando.do')

  assert.equal(signInSchema.safeParse({ email: 'invalido', password: 'secret' }).success, false)
  assert.equal(signInSchema.safeParse({ email: 'cliente@soleando.do', password: '' }).success, false)

  assert.equal(
    signUpSchema.safeParse({
      name: 'María Pérez',
      email: ' maria@soleando.do ',
      password: 'password-segura',
      confirmPassword: 'password-segura',
    }).success,
    true
  )
  assert.equal(
    signUpSchema.safeParse({
      name: 'M',
      email: 'maria@soleando.do',
      password: 'short',
      confirmPassword: 'different',
    }).success,
    false
  )
})

test('profile schema keeps only normalized optional contact data', () => {
  const result = profileSchema.safeParse({
    firstName: ' María ',
    lastName: ' Pérez ',
    phone: ' ',
    countryCode: ' do ',
  })

  assert.equal(result.success, true)
  assert.deepEqual(result.data, {
    firstName: 'María',
    lastName: 'Pérez',
    phone: null,
    countryCode: 'DO',
  })
  assert.equal(profileSchema.safeParse({ firstName: '', lastName: 'Pérez' }).success, false)
  assert.equal(profileSchema.safeParse({ firstName: 'María', lastName: 'x'.repeat(101) }).success, false)
})

test('traveler schema accepts past dates and normalizes blank optional fields', () => {
  const result = travelerSchema.safeParse({
    firstName: ' Ana ',
    lastName: ' Torres ',
    dateOfBirth: '1990-05-20',
    nationalityCode: ' do ',
  })

  assert.equal(result.success, true)
  assert.deepEqual(result.data, {
    firstName: 'Ana',
    lastName: 'Torres',
    dateOfBirth: '1990-05-20',
    nationalityCode: 'DO',
  })
  assert.equal(
    travelerSchema.safeParse({ firstName: 'Ana', lastName: 'Torres', dateOfBirth: dateOffset(1) }).success,
    false
  )
  assert.equal(
    travelerSchema.safeParse({ firstName: 'Ana', lastName: 'Torres', dateOfBirth: '   ', nationalityCode: ' ' }).data
      .dateOfBirth,
    null
  )
})

test('hotel provider search schema protects provider search constraints', () => {
  const validSearch = {
    destination: 'Punta Cana',
    providerDestinationId: 'PC123',
    providerDestinationType: 'city',
    checkIn: dateOffset(1),
    checkOut: dateOffset(4),
    adults: 2,
    childrenAges: [6],
    rooms: 1,
  }

  assert.equal(providerHotelSearchSchema.safeParse(validSearch).success, true)
  assert.equal(
    providerHotelSearchSchema.safeParse({ ...validSearch, providerDestinationId: 'PC-123' }).success,
    false
  )
  assert.equal(
    providerHotelSearchSchema.safeParse({ ...validSearch, checkIn: dateOffset(-1) }).success,
    false
  )
  assert.equal(
    providerHotelSearchSchema.safeParse({ ...validSearch, checkOut: validSearch.checkIn }).success,
    false
  )
  assert.equal(providerHotelSearchSchema.safeParse({ ...validSearch, adults: 1, rooms: 2 }).success, false)
  assert.equal(
    providerHotelSearchSchema.safeParse({ ...validSearch, childrenAges: [1, 2, 3, 4, 5] }).success,
    false
  )
})
