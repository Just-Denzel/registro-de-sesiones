import type { Prisma } from '@prisma/client'

export type StudentWithSessionCount = Prisma.StudentGetPayload<{
  include: { _count: { select: { sessions: true } } }
}>

export type StudentWithSessions = Prisma.StudentGetPayload<{
  include: { sessions: true }
}>
