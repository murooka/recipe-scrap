import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isErr, unwrapOk } from "option-t/plain_result";

import { verifySession } from "@facade/auth";
import type { User } from "@facade/types";
import { COOKIE_NAME_SESSION } from "@web/cookie";

export async function authenticate(): Promise<User> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME_SESSION);
  if (sessionCookie == null) redirect("/auth/login");

  const maybeUser = await verifySession(sessionCookie.value);
  if (isErr(maybeUser)) redirect("/auth/login");

  return unwrapOk(maybeUser);
}
