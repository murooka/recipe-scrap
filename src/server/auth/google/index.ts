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

type IdToken = {
  sub: string;
};
export async function getIdTokenClaim(
  code: string,
): Promise<Result<IdToken, "id_token_not_found" | "claim_not_found">> {
  const res = await client.getToken(code);
  const idToken = res.tokens.id_token;
  if (idToken == null) return err("id_token_not_found");

  const ticket = await client.verifyIdToken({ idToken });
  const claim = ticket.getPayload();
  if (claim == null) return err("claim_not_found");

  return ok({ sub: claim.sub });
}
