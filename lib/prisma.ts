import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from ".prisma/client";
import path from "path";

// Prevent multiple PrismaClient instances in development (hot-reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: `file:${path.join(process.cwd(), "prisma", "dev.db")}`,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
