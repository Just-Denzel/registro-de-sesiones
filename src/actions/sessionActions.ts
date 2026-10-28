'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ROUTES } from '@/lib/routes'
import { createSessionSchema } from '@/lib/validations/sessionValidation'
import { studentIdSchema } from '@/lib/validations/studentValidation'
import { createSessionForStudent } from '@/services/sessionService'
import type { CreateSessionFormState } from '@/types/sessionForm'

const SAVE_FAILED_MESSAGE = 'No se pudo guardar la sesión. Intenta nuevamente.'

export async function createSession(
      studentId: string,
      _previousState: CreateSessionFormState,
      formData: FormData,
    ): Promise<CreateSessionFormState> {

  const parsedStudentId = studentIdSchema.safeParse(studentId)
  if (!parsedStudentId.success) {
    return { status: 'error', fieldErrors: {}, formError: SAVE_FAILED_MESSAGE }
  }

  const parsedSession = createSessionSchema.safeParse(Object.fromEntries(formData))
  if (!parsedSession.success) {
    return { status: 'error', fieldErrors: z.flattenError(parsedSession.error).fieldErrors }
  }

  try {
    await createSessionForStudent(parsedStudentId.data, parsedSession.data)
  } catch {
    return { status: 'error', fieldErrors: {}, formError: SAVE_FAILED_MESSAGE }
  }

  revalidatePath(ROUTES.studentDetail(parsedStudentId.data))
  revalidatePath(ROUTES.students)
  return { status: 'success' }
}
