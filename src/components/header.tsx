import Link from "next/link";
import type { ReactNode } from "react";

type HeaderProps = unknown;
export function Header(_props: HeaderProps): ReactNode {
  return (
    <header className="">
      <Link href="/">
        <h1 className="bg-white px-4 py-3 text-xl font-bold">Recipe Scrap</h1>
      </Link>
    </header>
  );
}
