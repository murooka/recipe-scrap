import type { NextRequest } from "next/server";

import { issueSessionWithGoogle } from "@facade/auth";
import { verifyCallback } from "@facade/google";
import { COOKIE_NAME_GOOGLE_STATE, COOKIE_NAME_SESSION, bakeCookie } from "@web/cookie";

export const dynamic = "force-dynamic";

function redirect(req: NextRequest, err: string) {
  const redirectUrl = new URL("/auth/login", req.nextUrl.origin);
  redirectUrl.searchParams.set("error", err);
  return Response.redirect(redirectUrl);
}

export async function GET(req: NextRequest): Promise<Response> {
  const cookieState = req.cookies.get(COOKIE_NAME_GOOGLE_STATE);
  if (cookieState == null) return redirect(req, "invalid_request");

  const claim = await verifyCallback(req.nextUrl, cookieState.value);
  if (claim.isErr()) return redirect(req, "invalid_request");

  const session = await issueSessionWithGoogle(claim.value.sub);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      ...bakeCookie(COOKIE_NAME_SESSION, session.token, "/", "strict", session.expiresAt),
    },
  });
}
