import { PrismaClient } from '@prisma/client'

// 1. Le decimos a TypeScript que globalThis puede tener un "prisma"
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 2. Si ya existe un cliente guardado, lo usamos; si no, creamos uno
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// 3. En desarrollo, lo guardamos para que sobreviva al hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}