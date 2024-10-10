import type { NextRequest } from "next/server";

import type { User } from "@server/auth";
import { createUserWithGoogleUserId, getUserByGoogleUserId, issueSession } from "@server/auth";
import { getGoogleUser } from "@server/auth/google";
import { COOKIE_NAME_GOOGLE_STATE, COOKIE_NAME_SESSION, bakeCookie } from "@server/cookie";

export const dynamic = "force-dynamic";

function redirect(req: NextRequest, err: string) {
  const redirectUrl = new URL("/auth/login", req.nextUrl.origin);
  redirectUrl.searchParams.set("error", err);
  return Response.redirect(redirectUrl);
}

export async function GET(req: NextRequest): Promise<Response> {
  const state = req.nextUrl.searchParams.get("state");
  const cookieState = req.cookies.get(COOKIE_NAME_GOOGLE_STATE);
  if (state !== cookieState?.value) return redirect(req, "invalid_request");

  const code = req.nextUrl.searchParams.get("code");
  if (code == null) return redirect(req, "invalid_request");

  const googleUser = await getGoogleUser(code);
  if (googleUser.isErr()) {
    return redirect(req, googleUser.error);
  }

  let user: User;
  const savedUser = await getUserByGoogleUserId(googleUser.value.userId);
  if (savedUser == null) {
    user = await createUserWithGoogleUserId(googleUser.value.userId);
  } else {
    user = savedUser;
  }

  const session = await issueSession(user);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      ...bakeCookie(COOKIE_NAME_SESSION, session.token, "/", "strict", session.expiresAt),
    },
  });
}
