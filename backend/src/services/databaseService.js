import { prisma } from '../database/prisma.js';

export async function connectDatabase() {
  await prisma.$connect();
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
