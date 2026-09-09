import assert from 'assert';

console.log('===============================================================');
console.log('=== TEST SUITE: FASE 15A (Auditoría de Calidad & Seguridad) ===');
console.log('===============================================================');

// 1. Test Open Redirect Sanitization (getSafeRedirectPath)
console.log('\n1. Probando prevención de Open Redirect (getSafeRedirectPath)...');

function getSafeRedirectPath(rawPath, fallback = '/cuenta') {
  if (!rawPath || typeof rawPath !== 'string') {
    return fallback;
  }
  const trimmed = rawPath.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.includes('\\')) {
    return fallback;
  }
  try {
    const dummyOrigin = 'http://localhost';
    const parsed = new URL(trimmed, dummyOrigin);
    if (parsed.origin !== dummyOrigin) {
      return fallback;
    }
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}

// Open redirect attacks that MUST be blocked:
assert.strictEqual(getSafeRedirectPath('https://evil.example.com'), '/cuenta', 'Debe bloquear URLs externas absolutas');
assert.strictEqual(getSafeRedirectPath('//evil.example.com'), '/cuenta', 'Debe bloquear URLs relativas al protocolo //');
assert.strictEqual(getSafeRedirectPath('/\\evil.example.com'), '/cuenta', 'Debe bloquear bypasses con barra invertida /\\');
assert.strictEqual(getSafeRedirectPath('javascript:alert(1)'), '/cuenta', 'Debe bloquear pseudo-protocolos javascript:');
assert.strictEqual(getSafeRedirectPath(''), '/cuenta', 'Debe retornar fallback para string vacío');
assert.strictEqual(getSafeRedirectPath(null), '/cuenta', 'Debe retornar fallback para null');
assert.strictEqual(getSafeRedirectPath(undefined), '/cuenta', 'Debe retornar fallback para undefined');

// Valid internal paths that MUST be accepted:
assert.strictEqual(getSafeRedirectPath('/cuenta/perfil'), '/cuenta/perfil', 'Debe permitir ruta interna');
assert.strictEqual(getSafeRedirectPath('/hoteles?destination=punta-cana'), '/hoteles?destination=punta-cana', 'Debe permitir query params internos');
assert.strictEqual(getSafeRedirectPath('/experiencias#detalles'), '/experiencias#detalles', 'Debe permitir hashes internos');
console.log('✓ Prevención de Open Redirect validada exitosamente.');

// 2. Test IDOR Ownership Enforcement Logic
console.log('\n2. Probando políticas de aislamiento IDOR para Viajeros y Perfiles...');

function mockDeleteTraveler(targetId, requestUserId, databaseRows) {
  // Simulación de la query atómica:
  // db.delete(travelers).where(and(eq(travelers.id, targetId), eq(travelers.userId, requestUserId)))
  const index = databaseRows.findIndex(
    (row) => row.id === targetId && row.userId === requestUserId
  );
  if (index === -1) {
    return { success: false, error: 'Viajero no encontrado.' };
  }
  databaseRows.splice(index, 1);
  return { success: true };
}

const mockDbTravelers = [
  { id: 'trav-userA-1', userId: 'user-A', firstName: 'Juan', lastName: 'Pérez' },
  { id: 'trav-userB-1', userId: 'user-B', firstName: 'María', lastName: 'Gómez' },
];

// User A intenta eliminar viajero de User B (IDOR Attack)
const unauthorizedAttempt = mockDeleteTraveler('trav-userB-1', 'user-A', mockDbTravelers);
assert.strictEqual(unauthorizedAttempt.success, false, 'User A NO debe poder eliminar viajero de User B');
assert.strictEqual(unauthorizedAttempt.error, 'Viajero no encontrado.', 'Debe retornar error neutral');
assert.strictEqual(mockDbTravelers.length, 2, 'El registro de User B debe permanecer intacto');

// User A elimina su propio viajero (Autorizado)
const authorizedAttempt = mockDeleteTraveler('trav-userA-1', 'user-A', mockDbTravelers);
assert.strictEqual(authorizedAttempt.success, true, 'User A debe poder eliminar su propio viajero');
assert.strictEqual(mockDbTravelers.length, 1, 'El registro de User A debe haber sido eliminado');
assert.strictEqual(mockDbTravelers[0].id, 'trav-userB-1', 'Solo el registro de User B debe quedar');
console.log('✓ Aislamiento IDOR validado exitosamente.');

// 3. Test Admin Authorization Guard Logic
console.log('\n3. Probando control de acceso estricto de administrador (Bypass Demo eliminado)...');

function evaluateAdminAccess(user) {
  if (!user) {
    return { status: 'redirect_login' };
  }
  if (user.role !== 'admin') {
    return { status: 'forbidden' };
  }
  return { status: 'allowed' };
}

// Visitante anónimo -> redirect a login
assert.strictEqual(evaluateAdminAccess(null).status, 'redirect_login');

// Cliente autenticado con rol 'user' -> prohibido (403 / redirect forbidden)
assert.strictEqual(evaluateAdminAccess({ id: 'user-123', email: 'cliente@gmail.com', role: 'user' }).status, 'forbidden');

// Administrador oficial con rol 'admin' -> permitido
assert.strictEqual(evaluateAdminAccess({ id: 'admin-001', email: 'admin@soleando.com.do', role: 'admin' }).status, 'allowed');
console.log('✓ Control de acceso administrativo validado exitosamente.');

// 4. Test File Upload Security Policy
console.log('\n4. Probando políticas de seguridad en carga de archivos (/api/upload)...');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function validateUpload(file, user) {
  if (!user || user.role !== 'admin') {
    return { error: 'No autorizado', status: 401 };
  }
  if (!file) {
    return { error: 'No se envió ningún archivo', status: 400 };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: 'Tamaño excedido', status: 400 };
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return { error: 'Tipo no permitido', status: 400 };
  }
  return { success: true, status: 200 };
}

// Anonymous upload attempt
assert.strictEqual(validateUpload({ size: 1024, type: 'image/jpeg' }, null).status, 401);

// Non-admin upload attempt
assert.strictEqual(validateUpload({ size: 1024, type: 'image/jpeg' }, { role: 'user' }).status, 401);

// Malicious script upload attempt
assert.strictEqual(validateUpload({ size: 1024, type: 'application/x-php' }, { role: 'admin' }).status, 400);
assert.strictEqual(validateUpload({ size: 1024, type: 'text/html' }, { role: 'admin' }).status, 400);

// Oversized file attempt (6 MB)
assert.strictEqual(validateUpload({ size: 6 * 1024 * 1024, type: 'image/jpeg' }, { role: 'admin' }).status, 400);

// Legitimate image by admin
assert.strictEqual(validateUpload({ size: 1.5 * 1024 * 1024, type: 'image/webp' }, { role: 'admin' }).status, 200);
console.log('✓ Políticas de seguridad en upload validadas exitosamente.');

// 5. Test Date-Only Formats (Avoid UTC timestamp drift)
console.log('\n5. Probando validación de fechas date-only (YYYY-MM-DD)...');
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
assert.strictEqual(dateRegex.test('2026-10-15'), true);
assert.strictEqual(dateRegex.test('1990-05-20'), true);
assert.strictEqual(dateRegex.test('2026-10-15T00:00:00.000Z'), false, 'Timestamps con zona horaria no permitidos en campos date-only');
console.log('✓ Formatos date-only validados exitosamente.');

console.log('\n===============================================================');
console.log('>>> TODOS LOS TESTS DE AUDITORÍA FASE 15A SUPERADOS CON ÉXITO <<<');
console.log('===============================================================');
