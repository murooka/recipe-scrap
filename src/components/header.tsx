import Link from "next/link";
import type { ReactNode } from "react";

type HeaderProps = unknown;
export function Header(_props: HeaderProps): ReactNode {
  return (
    <header className="bg-beige">
      <Link href="/">
        <h1 className="px-4 py-3 text-xl font-bold">Recipe Scrap</h1>
      </Link>
    </header>
  );
}
