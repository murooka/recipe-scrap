export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { verifySession } from "@facade/auth";
import { COOKIE_NAME_SESSION } from "@web/cookie";

export default async function Home(): Promise<ReactNode> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME_SESSION);
  if (sessionCookie == null) redirect("/auth/login");

  const maybeUser = await verifySession(sessionCookie.value);
  if (maybeUser.isErr()) redirect("/auth/login");

  const user = maybeUser.value;

  return (
    <main className="grid h-screen w-full place-items-center">
      <div>
        <p>Hello, {user.id}!</p>
        <Link href="/foo">Go to foo</Link>
      </div>
    </main>
  );
}
