import "server-only";

import { err, ok } from "neverthrow";
import type { Result } from "neverthrow";

import { createSecureRandomString } from "@server/util/data";

import { prisma } from "../db";

export type User = {
  id: string;
};

export async function getUserByGoogleUserId(id: string): Promise<User | null> {
  const googleAuth = await prisma.userAuthGoogle.findUnique({ where: { id } });
  if (googleAuth == null) return null;

  return await prisma.user.findUnique({ where: { id: googleAuth.userId } });
}

export async function createUserWithGoogleUserId(id: string): Promise<User> {
  const user = await prisma.user.create({
    data: {
      UserAuthGoogle: {
        create: { id },
      },
    },
  });
  return user;
}

export type Session = {
  token: string;
  userId: string;
  expiresAt: Date;
};
export async function issueSession(user: User): Promise<Session> {
  const token = createSecureRandomString(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const data = {
    token,
    userId: user.id,
    expiresAt,
  };
  await prisma.session.create({ data });
  return data;
}

export async function verifySession(
  token: string,
): Promise<Result<User, "session_not_found" | "session_expired" | "user_not_found">> {
  const session = await prisma.session.findUnique({ where: { token } });
  if (session == null) return err("session_not_found");

  if (session.expiresAt < new Date()) {
    return err("session_expired");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (user == null) return err("user_not_found");

  return ok(user);
}
