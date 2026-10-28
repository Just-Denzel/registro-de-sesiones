import type { Session } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { CreateSessionData } from '@/lib/validations/sessionValidation'

export async function createSessionForStudent(
  studentId: string,
  sessionData: CreateSessionData,
): Promise<Session> {
  return prisma.session.create({
    data: { ...sessionData, studentId },
  })
}
