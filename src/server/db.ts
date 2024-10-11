import { PrismaClient } from "@prisma/client";

export let prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

export function __setTestPrismaClient(client: PrismaClient): void {
  prisma = client;
}
