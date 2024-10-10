import "server-only";

import { err, ok } from "neverthrow";
import type { Result } from "neverthrow";
import { ulid } from "ulid";

import { createSecureRandomString } from "@server/util/data";

export type User = {
  id: string;
};

const usersById = new Map<string, User>();
const userIdByGoogleUserId = new Map<string, string>();

// eslint-disable-next-line @typescript-eslint/require-await
export async function getUserByGoogleUserId(id: string): Promise<User | null> {
  const userId = userIdByGoogleUserId.get(id);
  if (userId == null) return null;

  return usersById.get(userId)!;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function createUserWithGoogleUserId(id: string): Promise<User> {
  const user: User = { id: ulid() };
  usersById.set(user.id, user);
  userIdByGoogleUserId.set(id, user.id);
  return user;
}

export type Session = {
  token: string;
  userId: string;
  expiresAt: Date;
};
const sessionByToken = new Map<string, Session>();
// eslint-disable-next-line @typescript-eslint/require-await
export async function issueSession(user: User): Promise<Session> {
  const token = createSecureRandomString(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const session = { token, userId: user.id, expiresAt };
  sessionByToken.set(token, session);
  return session;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function verifySession(
  token: string,
): Promise<Result<User, "session_not_found" | "session_expired" | "user_not_found">> {
  const session = sessionByToken.get(token);
  if (session == null) return err("session_not_found");

  if (session.expiresAt < new Date()) {
    sessionByToken.delete(token);
    return err("session_expired");
  }

  const user = usersById.get(session.userId);
  if (user == null) return err("user_not_found");

  return ok(user);
}
