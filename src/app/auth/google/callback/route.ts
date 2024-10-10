import type { NextRequest } from "next/server";

import { issueSessionWithGoogle } from "@facade/auth";
import { verifyCallback } from "@facade/google";
import { COOKIE_NAME_GOOGLE_STATE, COOKIE_NAME_SESSION, bakeCookie } from "@web/cookie";

export const dynamic = "force-dynamic";

function redirect(req: NextRequest, err: string) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/auth/login?error=${err}`,
    },
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  const cookieState = req.cookies.get(COOKIE_NAME_GOOGLE_STATE);
  if (cookieState == null) {
    console.log("state cookie not found");
    return redirect(req, "invalid_request");
  }

  const claim = await verifyCallback(req.nextUrl, cookieState.value);
  if (claim.isErr()) {
    console.log("failed to obtain id token claim", claim.error);
    return redirect(req, "invalid_request");
  }

  const session = await issueSessionWithGoogle(claim.value.sub);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      ...bakeCookie(COOKIE_NAME_SESSION, session.token, "/", "strict", session.expiresAt),
    },
  });
}
