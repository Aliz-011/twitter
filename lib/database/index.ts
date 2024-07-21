import { PrismaClient } from '@prisma/client';

const prismaSingleton = () => new PrismaClient();

declare global {
  var prisma: undefined | ReturnType<typeof prismaSingleton>;
}
export const client = globalThis.prisma ?? prismaSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;
