import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { addCalendarDays } from '../lib/calendar-date.ts'

test('calendar day arithmetic handles month, year and leap-day boundaries', () => {
  assert.equal(addCalendarDays('2026-12-31', 1), '2027-01-01')
  assert.equal(addCalendarDays('2028-02-28', 1), '2028-02-29')
  assert.equal(addCalendarDays('2026-03-07', 2), '2026-03-09')
})

test('suggested hotel dates use the local calendar near UTC midnight and across DST', () => {
  const scenarios = [
    ['America/Santo_Domingo', '2026-10-18T00:30:00Z', '2026-10-17', '2026-10-24'],
    ['Asia/Tokyo', '2026-10-17T23:30:00Z', '2026-10-18', '2026-10-25'],
    ['America/New_York', '2026-03-07T17:00:00Z', '2026-03-07', '2026-03-14'],
  ]
  for (const [timezone, instant, today, nextWeek] of scenarios) {
    const result = spawnSync(process.execPath, [
      '--no-warnings', '--experimental-strip-types', '--input-type=module', '-e',
      `import { formatLocalCalendarDate, addCalendarDays } from './lib/calendar-date.ts';
       const today = formatLocalCalendarDate(new Date('${instant}'));
       process.stdout.write(JSON.stringify([today, addCalendarDays(today, 7)]));`,
    ], { cwd: process.cwd(), env: { ...process.env, TZ: timezone }, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
    assert.deepEqual(JSON.parse(result.stdout), [today, nextWeek], timezone)
  }
})
