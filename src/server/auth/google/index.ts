import "server-only";

import { OAuth2Client } from "google-auth-library";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";

const client = new OAuth2Client(
  process.env.GOOGLE_OAUTH2_CLIENT_ID,
  process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH2_CALLBACK_URL,
);

export function createGoogleAuthUrl(state: string): string {
  return client.generateAuthUrl({ scope: ["openid"], prompt: "", state });
}

export async function getGoogleUser(
  code: string,
): Promise<Result<{ userId: string }, "invalid_code" | "invalid_id_token">> {
  const res = await client.getToken(code);
  const idToken = res.tokens.id_token;
  if (!idToken) return err("invalid_code");

  const ticket = await client.verifyIdToken({ idToken });
  const userId = ticket.getUserId();
  if (!userId) return err("invalid_id_token");

  return ok({ userId });
}
