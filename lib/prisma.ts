import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const createPrismaClient = () => {
  const client = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
  });
  return client.$extends(withAccelerate());
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = global as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
