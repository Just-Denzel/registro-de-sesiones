import { z } from 'zod'
import { formatCalendarDate, isInvalidDate, parseCalendarDate } from '../dates'

export const SESSION_FIELD_LIMITS = {
  durationMinutes: { min: 15, max: 180 },
  topic: { min: 1, max: 120 },
  notes: { max: 500 },
} as const

const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DIGITS_ONLY_PATTERN = /^\d+$/

const { durationMinutes, topic, notes } = SESSION_FIELD_LIMITS

export const SESSION_ERROR_MESSAGES = {
  dateRequired: 'La fecha es obligatoria',
  invalidDateFormat: 'Ingresa una fecha válida, con un año de 4 dígitos',
  nonexistentDate: 'La fecha no existe en el calendario',
  durationRequired: 'La duración es obligatoria',
  durationNotInteger: 'La duración debe ser un número entero de minutos',
  durationBelowMin: `La duración mínima es ${durationMinutes.min} minutos`,
  durationAboveMax: `La duración máxima es ${durationMinutes.max} minutos`,
  topicRequired: 'El tema es obligatorio',
  topicTooLong: `El tema puede tener como máximo ${topic.max} caracteres`,
  notesTooLong: `Las notas pueden tener como máximo ${notes.max} caracteres`,
} as const

const failFast = (message: string) => ({ error: message, abort: true })

function isExistingCalendarDate(calendarDate: string): boolean {
  const parsedDate = parseCalendarDate(calendarDate)
  if (isInvalidDate(parsedDate)) return false

  const dateAfterRoundTrip = formatCalendarDate(parsedDate)
  return dateAfterRoundTrip === calendarDate
}

const emptyToNull = (value: string | null | undefined): string | null => value || null

const dateField = z
  .string({ error: SESSION_ERROR_MESSAGES.dateRequired })
  .trim()
  .nonempty(failFast(SESSION_ERROR_MESSAGES.dateRequired))
  .regex(CALENDAR_DATE_PATTERN, failFast(SESSION_ERROR_MESSAGES.invalidDateFormat))
  .refine(isExistingCalendarDate, SESSION_ERROR_MESSAGES.nonexistentDate)
  .transform(parseCalendarDate)

const durationMinutesField = z
  .string({ error: SESSION_ERROR_MESSAGES.durationRequired })
  .trim()
  .nonempty(failFast(SESSION_ERROR_MESSAGES.durationRequired))
  .regex(DIGITS_ONLY_PATTERN, failFast(SESSION_ERROR_MESSAGES.durationNotInteger))
  .transform(Number)
  .pipe(
    z
      .number()
      .int(SESSION_ERROR_MESSAGES.durationNotInteger)
      .min(durationMinutes.min, SESSION_ERROR_MESSAGES.durationBelowMin)
      .max(durationMinutes.max, SESSION_ERROR_MESSAGES.durationAboveMax),
  )

const topicField = z
  .string({ error: SESSION_ERROR_MESSAGES.topicRequired })
  .trim()
  .min(topic.min, SESSION_ERROR_MESSAGES.topicRequired)
  .max(topic.max, SESSION_ERROR_MESSAGES.topicTooLong)

const notesField = z
  .string()
  .trim()
  .max(notes.max, SESSION_ERROR_MESSAGES.notesTooLong)
  .nullish()
  .transform(emptyToNull)

export const createSessionSchema = z.object({
  date: dateField,
  durationMinutes: durationMinutesField,
  topic: topicField,
  notes: notesField,
})

export type CreateSessionFormValues = z.input<typeof createSessionSchema>
export type CreateSessionData = z.output<typeof createSessionSchema>
