import "server-only";

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
// eslint-disable-next-line @typescript-eslint/require-await
export async function issueSession(user: User): Promise<Session> {
  const token = createSecureRandomString(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  return { token, userId: user.id, expiresAt };
}
