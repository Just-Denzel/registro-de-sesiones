import type { CreateSessionFormValues } from '@/lib/validations/sessionValidation'

export type SessionFormFieldErrors = Partial<Record<keyof CreateSessionFormValues, string[]>>

export type CreateSessionFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; fieldErrors: SessionFormFieldErrors; formError?: string }
