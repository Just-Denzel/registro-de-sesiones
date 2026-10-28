'use client'

import { useEffect, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { createSession } from '@/actions/sessionActions'
import { SESSION_FIELD_LIMITS } from '@/lib/validations/sessionValidation'
import type { CreateSessionFormState, SessionFormFieldErrors } from '@/types/sessionForm'

const INITIAL_FORM_STATE: CreateSessionFormState = { status: 'idle' }
const NO_FIELD_ERRORS: SessionFormFieldErrors = {}
const SAVED_MESSAGE = 'Sesión guardada.'
const LATEST_FOUR_DIGIT_YEAR_DATE = '9999-12-31'

type SessionFormProps = {
  studentId: string
}

export function SessionForm({ studentId }: SessionFormProps) {
  const createSessionForStudent = createSession.bind(null, studentId)
  const [formState, formAction] = useFormState(createSessionForStudent, INITIAL_FORM_STATE)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formState.status === 'success') formRef.current?.reset()
  }, [formState])

  const fieldErrors = formState.status === 'error' ? formState.fieldErrors : NO_FIELD_ERRORS
  const { durationMinutes, topic, notes } = SESSION_FIELD_LIMITS

  return (
    <form ref={formRef} action={formAction} noValidate className="session-form">
      <label htmlFor="session-date">Fecha</label>
      <input id="session-date" name="date" type="date" max={LATEST_FOUR_DIGIT_YEAR_DATE} />
      <FieldError messages={fieldErrors.date} />

      <label htmlFor="session-duration">
        Duración{' '}
        <span className="field-hint">
          ({durationMinutes.min}–{durationMinutes.max} minutos)
        </span>
      </label>
      <input
        id="session-duration"
        name="durationMinutes"
        type="number"
        min={durationMinutes.min}
        max={durationMinutes.max}
        step={1}
        defaultValue={durationMinutes.min}
      />
      <FieldError messages={fieldErrors.durationMinutes} />

      <label htmlFor="session-topic">
        Tema{' '}
        <span className="field-hint">
          ({topic.min}–{topic.max} caracteres)
        </span>
      </label>
      <input id="session-topic" name="topic" type="text" />
      <FieldError messages={fieldErrors.topic} />

      <label htmlFor="session-notes">
        Notas{' '}
        <span className="field-hint">(opcional, máximo {notes.max} caracteres)</span>
      </label>
      <textarea id="session-notes" name="notes" rows={3} />
      <FieldError messages={fieldErrors.notes} />

      {formState.status === 'error' && formState.formError && (
        <p role="alert" className="form-error">{formState.formError}</p>
      )}
      {formState.status === 'success' && <p className="form-success">{SAVED_MESSAGE}</p>}

      <SubmitButton />
    </form>
  )
}

type FieldErrorProps = {
  messages?: string[]
}

function FieldError({ messages }: FieldErrorProps) {
  const firstMessage = messages?.[0]
  if (!firstMessage) return null

  return <p role="alert" className="form-error">{firstMessage}</p>
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Guardando…' : 'Guardar sesión'}
    </button>
  )
}
