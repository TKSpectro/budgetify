import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.DATABASE_LOGGING === 'true' ? ['query', 'warn', 'error'] : ['warn', 'error'],
});

export interface Context {
  prisma: PrismaClient;
}

export function createContext(): Context {
  return { prisma };
}
