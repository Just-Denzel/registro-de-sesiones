import { PrismaClient } from '@prisma/client'
import { parseCalendarDate } from '../src/lib/dates'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  // Limpiar primero para que el seed se pueda correr varias veces
  await prisma.session.deleteMany()
  await prisma.student.deleteMany()

  // Estudiantes con sesiones: se crean junto con sus sesiones (nested create)
  await prisma.student.create({
    data: {
      firstName: 'Ana',
      lastName: 'Rojas',
      course: '5 basico',
      sessions: {
        create: [{ date: parseCalendarDate('2026-10-15'), durationMinutes: 60, topic: 'Fracciones' }],
      },
    },
  })

  await prisma.student.create({
    data: {
      firstName: 'Elena',
      lastName: 'Fuentes',
      course: '7 basico',
      sessions: {
        create: [{ date: parseCalendarDate('2026-10-02'), durationMinutes: 45, topic: 'Comprension lectora' }],
      },
    },
  })

  // Estudiantes sin sesiones
  await prisma.student.createMany({
    data: [
      { firstName: 'Bruno', lastName: 'Soto', course: '6 basico' },
      { firstName: 'Carla', lastName: 'Diaz', course: '1 medio' },
      { firstName: 'Diego', lastName: 'Munoz', course: '2 medio' },
    ],
  })

  const [students, sessions] = await Promise.all([
    prisma.student.count(),
    prisma.session.count(),
  ])
  console.log(`Seed listo: ${students} estudiantes, ${sessions} sesiones`)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
