import { PrismaClient } from "./generated/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as mariadb from "mariadb";

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL;
  const adapter = url ? new PrismaMariaDb(url) : undefined;
  return new PrismaClient(adapter ? { adapter } : undefined);
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;