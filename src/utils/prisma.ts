import { PrismaClient } from '@prisma/client';

declare global {
  var __globalPrisma__: PrismaClient;
}
/**
 * We can import the prisma client anywhere in our application from this place
 * to get access to a new or already existing instance of prisma. */
export let prisma: PrismaClient;

// Depending on the environment we can log different prisma outputs
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
