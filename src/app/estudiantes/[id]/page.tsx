import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ROUTES } from '@/lib/routes'
import { studentIdSchema } from '@/lib/validations/studentValidation'
import { findStudentWithSessions } from '@/services/studentService'
import { SessionForm } from './SessionForm'
import { SessionsTable } from './SessionsTable'

type StudentDetailPageProps = {
  params: { id: string }
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const parsedStudentId = studentIdSchema.safeParse(params.id)
  if (!parsedStudentId.success) notFound()

  const student = await findStudentWithSessions(parsedStudentId.data)
  if (!student) notFound()

  const hasSessions = student.sessions.length > 0

  return (
    <section>
      <Link href={ROUTES.students}>← Volver a estudiantes</Link>

      <h2>
        {student.firstName} {student.lastName}
      </h2>
      <p>Curso: {student.course}</p>

      <h3>Sesiones</h3>
      {hasSessions ? (
        <SessionsTable sessions={student.sessions} />
      ) : (
        <p>Este estudiante aún no tiene sesiones.</p>
      )}

      <h3>Nueva sesión</h3>
      <SessionForm studentId={student.id} />
    </section>
  )
}
