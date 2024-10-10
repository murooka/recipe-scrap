import { PrismaClient } from "@prisma/client";

export let prisma = new PrismaClient();

export function __setTestPrismaClient(client: PrismaClient): void {
  prisma = client;
}
