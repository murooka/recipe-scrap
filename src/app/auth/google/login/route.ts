export const dynamic = "force-dynamic";

import { cookies } from "next/headers";

import { prepareAuthzRequest } from "@facade/google";
import { COOKIE_NAME_GOOGLE_STATE } from "@web/cookie";

export async function GET(_req: Request): Promise<Response> {
  const redirectUri = new URL("/auth/google/callback", process.env.ORIGIN).toString();
  const { url, state } = prepareAuthzRequest(redirectUri);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME_GOOGLE_STATE, state, { path: "/auth/google", sameSite: "lax" });

  return Response.redirect(url);
}
