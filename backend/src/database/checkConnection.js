import { prisma } from './prisma.js';

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log('Neon PostgreSQL connection verified.');
} finally {
  await prisma.$disconnect();
}
