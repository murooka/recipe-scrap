export const dynamic = "force-dynamic";

import Link from "next/link";
import type { ReactNode } from "react";

import { authenticate } from "./authenticate";

export default async function Home(): Promise<ReactNode> {
  const user = await authenticate();

  return (
    <main className="grid h-screen w-full place-items-center">
      <div>
        <p>Hello, {user.id}!</p>
        <Link href="/foo">Go to foo</Link>
      </div>
    </main>
  );
}
