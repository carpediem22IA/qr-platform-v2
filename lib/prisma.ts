import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL!;

// Agregar timezone a la conexión
const connectionStringWithTimezone = connectionString.includes("?")
  ? `${connectionString}&timezone=Europe/Madrid`
  : `${connectionString}?timezone=Europe/Madrid`;

const adapter = new PrismaPg({
  connectionString: connectionStringWithTimezone,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}