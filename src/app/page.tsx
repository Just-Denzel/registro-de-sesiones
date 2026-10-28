import Link from 'next/link'
import { ROUTES } from '@/lib/routes'

export default function HomePage() {
  return (
    <section>
      <p>
        Lleva el registro de las sesiones de apoyo escolar: revisa cuántas sesiones lleva cada
        estudiante, consulta su historial y anota nuevas sesiones con fecha, duración, tema y notas.
      </p>
      <Link href={ROUTES.students}>Ver estudiantes</Link>
    </section>
  )
}
