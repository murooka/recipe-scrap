import Link from "next/link";
import type { ReactNode } from "react";

export default function Home(): ReactNode {
  return (
    <main className="grid h-screen w-full place-items-center">
      <div>
        <p>Hello, world!</p>
        <Link href="/foo">Go to foo</Link>
      </div>
    </main>
  );
}
