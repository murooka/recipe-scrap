import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";

import { createUserWithGoogle, getUserByGoogle, issueSession } from "../auth";
import type { Session, User } from "../auth";
import { prisma } from "../db";

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
