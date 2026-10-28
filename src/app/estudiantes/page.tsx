import Link from 'next/link'
import { ROUTES } from '@/lib/routes'
import { findStudentsSortedByLastName } from '@/services/studentService'

export default async function StudentsPage() {
  const students = await findStudentsSortedByLastName()
  
  return (
    <section>
      <Link href={ROUTES.home}>← Volver al inicio</Link>

      <h2>Estudiantes</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Apellido</th>
            <th scope="col">Curso</th>
            <th scope="col">Cantidad de sesiones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <Link href={ROUTES.studentDetail(student.id)}>{student.firstName}</Link>
              </td>
              <td>{student.lastName}</td>
              <td>{student.course}</td>
              <td>{student._count.sessions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

  )
}
