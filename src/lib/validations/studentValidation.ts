import { z } from 'zod'

export const STUDENT_ERROR_MESSAGES = {
  invalidId: 'Id de estudiante inválido',
} as const

export const studentIdSchema = z.uuid(STUDENT_ERROR_MESSAGES.invalidId)
