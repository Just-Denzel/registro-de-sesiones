import { prisma } from '@/lib/prisma'
import type { StudentWithSessionCount, StudentWithSessions } from '@/types/student'

export async function findStudentsSortedByLastName(): Promise<StudentWithSessionCount[]> {
  return prisma.student.findMany({
    orderBy: [{lastName: 'asc' }, {firstName: 'asc'}],
    include: {_count: { select: { sessions: true}}}
  }); 

}

export async function findStudentWithSessions(studentId: string): Promise<StudentWithSessions | null> {
  return prisma.student.findUnique({
    where: { id: studentId },
    include: { 
      sessions:  {
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }]
      }
    }
  })
}
