import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient
}

const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

export { db }
