import "server-only";

import { createErr, createOk, isErr, unwrapErr, unwrapOk } from "option-t/plain_result";
import type { Result } from "option-t/plain_result";

import { createGoogleAuthUrl, getIdTokenClaim } from "../server/auth/google";
import { createSecureRandomString } from "../server/util/data";

export function prepareAuthzRequest(): { url: string; state: string } {
  const state = createSecureRandomString(12);
  const url = createGoogleAuthUrl(state);
  return { url, state };
}

export async function verifyCallback(
  url: URL,
  cookieState: string,
): Promise<
  Result<
    { sub: string },
    "invalid_state" | "code_not_found" | "invalid_code" | "id_token_not_found" | "claim_not_found"
  >
> {
  const state = url.searchParams.get("state");
  if (state !== cookieState) return createErr("invalid_state");

  const code = url.searchParams.get("code");
  if (code == null) return createErr("code_not_found");

  const claim = await getIdTokenClaim(code);
  if (isErr(claim)) return createErr(unwrapErr(claim));

  return createOk({ sub: unwrapOk(claim).sub });
}
