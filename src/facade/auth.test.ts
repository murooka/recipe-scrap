import "../test/register/server-only";

import { isOk, unwrapOk } from "option-t/plain_result";
import { describe, test, expect, beforeAll } from "vitest";

import { prisma } from "../server/db";
import { setupPostgres } from "../test/postgres";

import { verifySession } from "./auth";

describe("verifySession", () => {
  beforeAll(setupPostgres);

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
    expect(isOk(user)).toBe(true);
    expect(unwrapOk(user)).toMatchObject({ id: expect.any(String) });
  });
});
