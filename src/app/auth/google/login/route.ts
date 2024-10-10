export const dynamic = "force-dynamic";

import { prepareAuthzRequest } from "@facade/google";
import { COOKIE_NAME_GOOGLE_STATE, bakeCookie } from "@web/cookie";

export function GET(_req: Request): Response {
  const { url, state } = prepareAuthzRequest();

  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      ...bakeCookie(COOKIE_NAME_GOOGLE_STATE, state, "/auth/google", "lax"),
    },
  });
}
