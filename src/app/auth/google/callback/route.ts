import type { NextRequest } from "next/server";
import { isErr, unwrapErr, unwrapOk } from "option-t/plain_result";

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
  if (isErr(claim)) {
    console.log("failed to obtain id token claim", unwrapErr(claim));
    return redirect(req, "invalid_request");
  }

  const session = await issueSessionWithGoogle(unwrapOk(claim).sub);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      ...bakeCookie(COOKIE_NAME_SESSION, session.token, "/", "strict", session.expiresAt),
    },
  });
}
