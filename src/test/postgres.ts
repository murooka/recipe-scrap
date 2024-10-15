import { exec } from "node:child_process";
import { promisify } from "node:util";

import { PrismaClient } from "@prisma/client";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

import { __setTestPrismaClient } from "../server/db";

const execAsync = promisify(exec);

type TeardownFn = () => Promise<void>;
export async function setupPostgres(): Promise<TeardownFn> {
  const container = await new PostgreSqlContainer().start();

  const databaseUrl = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/common?schema=public`;
  await execAsync(`DATABASE_URL=${databaseUrl} npx prisma migrate dev --skip-generate`);

  const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  __setTestPrismaClient(prisma);

  return async () => {
    await container.stop();
  };
}
