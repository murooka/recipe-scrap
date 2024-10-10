import { prisma } from "../db";
import { createSecureRandomString } from "../util/data";

export type User = {
  id: string;
};

export async function getUserByGoogle(sub: string): Promise<User | null> {
  const googleAuth = await prisma.userAuthGoogle.findUnique({ where: { id: sub } });
  if (googleAuth == null) return null;

  return await prisma.user.findUnique({ where: { id: googleAuth.userId } });
}

export async function createUserWithGoogle(sub: string): Promise<User> {
  const user = await prisma.user.create({
    data: {
      UserAuthGoogle: {
        create: { id: sub },
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
