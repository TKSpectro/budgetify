import { PrismaClient } from '@prisma/client';

declare global {
  var __globalPrisma__: PrismaClient;
}

export let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['warn', 'error'],
  });
} else {
  if (!global.__globalPrisma__) {
    global.__globalPrisma__ = new PrismaClient({
      log: process.env.DATABASE_LOGGING === 'true' ? ['query', 'warn', 'error'] : ['warn', 'error'],
    });
  }
  prisma = global.__globalPrisma__;
}

export default prisma;
