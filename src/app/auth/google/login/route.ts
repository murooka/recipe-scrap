export const dynamic = "force-dynamic";

import { createGoogleAuthUrl } from "@server/auth/google";
import { COOKIE_NAME_GOOGLE_STATE, bakeCookie } from "@server/cookie";
import { createSecureRandomString } from "@server/util/data";

export function GET(_req: Request): Response {
  const state = createSecureRandomString(12);
  const url = createGoogleAuthUrl(state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      ...bakeCookie(COOKIE_NAME_GOOGLE_STATE, state, "/auth/google", "lax"),
    },
  });
}
