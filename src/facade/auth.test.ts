import { exec } from "node:child_process";
import { promisify } from "node:util";

import { PrismaClient } from "@prisma/client";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { describe, test, expect, beforeAll } from "vitest";

import { __setTestPrismaClient } from "../server/db";

import { verifySession } from "./auth";

const execAsync = promisify(exec);

describe("verifySession", () => {
  let prisma: PrismaClient;
  beforeAll(async () => {
    const container = await new PostgreSqlContainer().start();

    const databaseUrl = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/common?schema=public`;
    await execAsync(`DATABASE_URL=${databaseUrl} npx prisma migrate dev --skip-generate`);

    prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    __setTestPrismaClient(prisma);

    return () => container.stop();
  });

  test("success", async () => {
    // setup
    {
      const user = await prisma.user.create({ data: {} });
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      await prisma.session.create({ data: { token: "abc", userId: user.id, expiresAt } });
    }

    // exercise
    const user = await verifySession("abc");

    // verify
    expect(user.isOk()).toBe(true);
    expect(user._unsafeUnwrap()).toMatchObject({ id: expect.any(String) });
  });
});
