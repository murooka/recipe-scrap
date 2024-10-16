import "server-only";

import { createErr, createOk } from "option-t/plain_result";
import type { Result } from "option-t/plain_result";

import { createUserWithGoogle, getUserByGoogle, issueSession } from "../server/auth";
import type { Session, User } from "../server/auth";
import { prisma } from "../server/db";

export async function verifySession(
  token: string,
): Promise<Result<User, "session_not_found" | "session_expired" | "user_not_found">> {
  const session = await prisma.session.findUnique({ where: { token } });
  if (session == null) return createErr("session_not_found");

  if (session.expiresAt < new Date()) {
    return createErr("session_expired");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (user == null) return createErr("user_not_found");

  return createOk(user);
}

export async function issueSessionWithGoogle(sub: string): Promise<Session> {
  let user: User;
  const savedUser = await getUserByGoogle(sub);
  if (savedUser == null) {
    user = await createUserWithGoogle(sub);
  } else {
    user = savedUser;
  }

  const session = await issueSession(user);

  return session;
}
