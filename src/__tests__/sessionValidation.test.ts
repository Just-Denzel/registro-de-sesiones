import { describe, expect, it } from '@jest/globals'
import { z } from 'zod'
import {
  createSessionSchema,
  SESSION_ERROR_MESSAGES,
  type CreateSessionFormValues,
} from '@/lib/validations/sessionValidation'

const VALID_FORM_VALUES: CreateSessionFormValues = {
  date: '2026-10-15',
  durationMinutes: '60',
  topic: 'Fracciones',
  notes: '',
}

function parseWith(overrides: Partial<CreateSessionFormValues>) {
  return createSessionSchema.safeParse({ ...VALID_FORM_VALUES, ...overrides })
}

function expectValid(overrides: Partial<CreateSessionFormValues>): void {
  expect(parseWith(overrides).success).toBe(true)
}

function expectInvalid(
  overrides: Partial<CreateSessionFormValues>,
  field: keyof CreateSessionFormValues,
  expectedMessage: string,
): void {
  const result = parseWith(overrides)
  expect(result.success).toBe(false)
  if (result.success) return

  const fieldErrors = z.flattenError(result.error).fieldErrors
  expect(fieldErrors[field]?.[0]).toBe(expectedMessage)
}

describe('createSessionSchema', () => {
  it('durationMinutes: accepts 15 to 180 inclusive, rejects 14 and 181', () => {
    expectInvalid({ durationMinutes: '14' }, 'durationMinutes', SESSION_ERROR_MESSAGES.durationBelowMin)
    expectValid({ durationMinutes: '15' })
    expectValid({ durationMinutes: '16' })

    expectValid({ durationMinutes: '179' })
    expectValid({ durationMinutes: '180' })
    expectInvalid({ durationMinutes: '181' }, 'durationMinutes', SESSION_ERROR_MESSAGES.durationAboveMax)
  })

  it('durationMinutes: rejects values that are not whole numbers', () => {
    expectInvalid({ durationMinutes: '15.5' }, 'durationMinutes', SESSION_ERROR_MESSAGES.durationNotInteger)
    expectInvalid({ durationMinutes: 'abc' }, 'durationMinutes', SESSION_ERROR_MESSAGES.durationNotInteger)
  })

  it('topic: accepts 1 to 120 characters, rejects 0 and 121', () => {
    expectInvalid({ topic: '' }, 'topic', SESSION_ERROR_MESSAGES.topicRequired)
    expectValid({ topic: 'a' })
    expectValid({ topic: 'ab' })

    expectValid({ topic: 'a'.repeat(119) })
    expectValid({ topic: 'a'.repeat(120) })
    expectInvalid({ topic: 'a'.repeat(121) }, 'topic', SESSION_ERROR_MESSAGES.topicTooLong)
  })

  it('notes: accepts up to 500 characters, empty or missing; rejects 501', () => {
    expectValid({ notes: 'a'.repeat(499) })
    expectValid({ notes: 'a'.repeat(500) })
    expectInvalid({ notes: 'a'.repeat(501) }, 'notes', SESSION_ERROR_MESSAGES.notesTooLong)

    expect(parseWith({ notes: '' }).data?.notes).toBeNull()
    expect(parseWith({ notes: null }).data?.notes).toBeNull()
  })

  it('date: accepts 2026-02-27 and 2026-02-28, rejects 2026-02-29 (not a leap year)', () => {
    expectValid({ date: '2026-02-27' })
    expectValid({ date: '2026-02-28' })
    expectInvalid({ date: '2026-02-29' }, 'date', SESSION_ERROR_MESSAGES.nonexistentDate)
  })
})
