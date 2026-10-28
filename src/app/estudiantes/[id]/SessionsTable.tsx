import type { Session } from '@prisma/client'
import { formatCalendarDate } from '@/lib/dates'

const EMPTY_NOTES_PLACEHOLDER = '—'

type SessionsTableProps = {
  sessions: Session[]
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Duración</th>
          <th scope="col">Tema</th>
          <th scope="col">Notas</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <tr key={session.id}>
            <td>{formatCalendarDate(session.date)}</td>
            <td>{session.durationMinutes} min</td>
            <td>{session.topic}</td>
            <td>{session.notes ?? EMPTY_NOTES_PLACEHOLDER}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
