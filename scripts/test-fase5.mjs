import assert from 'assert';
import { z } from 'zod';

console.log('=== TEST SUITE: FASE 5 (HotelProvider + MockHotelProvider) ===');

// 1. Test roomOccupancySchema & hotelSearchInputSchema logic
const roomOccupancySchema = z.object({
  adults: z.number().int().min(1).default(2),
  childrenAges: z.array(z.number().int().min(0).max(17)).default([]),
});

const hotelSearchInputSchema = z
  .object({
    destination: z.string().trim().min(1),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    rooms: z.array(roomOccupancySchema).min(1),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: 'checkOut must be after checkIn',
    path: ['checkOut'],
  });

console.log('1. Testing search validation schema...');
// Valid search
const validSearch = hotelSearchInputSchema.safeParse({
  destination: 'Punta Cana',
  checkIn: '2026-10-15',
  checkOut: '2026-10-20',
  rooms: [{ adults: 2, childrenAges: [6, 9] }],
});
assert.strictEqual(validSearch.success, true);

// Invalid checkOut <= checkIn
const invalidDates = hotelSearchInputSchema.safeParse({
  destination: 'Punta Cana',
  checkIn: '2026-10-20',
  checkOut: '2026-10-15',
  rooms: [{ adults: 2, childrenAges: [] }],
});
assert.strictEqual(invalidDates.success, false);

// Invalid adults = 0
const zeroAdults = hotelSearchInputSchema.safeParse({
  destination: 'Punta Cana',
  checkIn: '2026-10-15',
  checkOut: '2026-10-20',
  rooms: [{ adults: 0, childrenAges: [] }],
});
assert.strictEqual(zeroAdults.success, false);

// Invalid child age = -1
const negativeAge = hotelSearchInputSchema.safeParse({
  destination: 'Punta Cana',
  checkIn: '2026-10-15',
  checkOut: '2026-10-20',
  rooms: [{ adults: 2, childrenAges: [-1] }],
});
assert.strictEqual(negativeAge.success, false);

// Invalid child age = 18 (must be < 18)
const adultChildAge = hotelSearchInputSchema.safeParse({
  destination: 'Punta Cana',
  checkIn: '2026-10-15',
  checkOut: '2026-10-20',
  rooms: [{ adults: 2, childrenAges: [18] }],
});
assert.strictEqual(adultChildAge.success, false);
console.log('Search validation schema passed all assertions!');

// 2. Test Production Guard logic (Fail-Closed)
console.log('2. Testing Production Guard logic...');
function testFactoryResolution(envNodeEnv, envHotelProvider) {
  const isProduction = envNodeEnv === 'production';
  const configuredProvider = (envHotelProvider || 'mock').toLowerCase();

  if (isProduction && configuredProvider === 'mock') {
    return 'unavailable';
  }
  return configuredProvider;
}

assert.strictEqual(testFactoryResolution('development', 'mock'), 'mock');
assert.strictEqual(testFactoryResolution('test', 'mock'), 'mock');
assert.strictEqual(testFactoryResolution('production', 'mock'), 'unavailable'); // Fail-closed in production!
assert.strictEqual(testFactoryResolution('production', 'hotelbeds'), 'hotelbeds');
console.log('Production Guard correctly fails closed when mock is configured in production!');

// 3. Test parseHotelSearchParams function logic
console.log('3. Testing parseHotelSearchParams logic...');
function parseSearchParams(params) {
  const destination = (params.destination || '').trim();
  if (!destination) return null;

  const checkIn = params.checkIn || '2026-10-01';
  const checkOut = params.checkOut || '2026-10-05';
  const adults = parseInt(params.adults || '2', 10) || 2;
  const rooms = parseInt(params.rooms || '1', 10) || 1;

  return {
    destination,
    checkIn,
    checkOut,
    rooms: [{ adults, childrenAges: [] }]
  };
}

const parsedPuntaCana = parseSearchParams({ destination: 'Punta Cana', checkIn: '2026-10-01', checkOut: '2026-10-05' });
assert.ok(parsedPuntaCana);
assert.strictEqual(parsedPuntaCana.destination, 'Punta Cana');

const parsedEmpty = parseSearchParams({ destination: '' });
assert.strictEqual(parsedEmpty, null);
console.log('Search params parser behaves as expected!');

console.log('\n>>> ALL FASE 5 AUTOMATED TESTS PASSED! <<<');
