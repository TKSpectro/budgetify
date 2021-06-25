import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['warn', 'error'],
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: process.env.DATABASE_LOGGING === 'true' ? ['query', 'warn', 'error'] : ['warn', 'error'],
    });
  }
  prisma = global.prisma;
}

export default prisma;
