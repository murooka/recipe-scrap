import "./globals.css";

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {};

type Props = Readonly<{
  children: React.ReactNode;
}>;
export default function RootLayout({ children }: Props): ReactNode {
  return (
    <html lang="ja">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body className="text-dark">
        <header className="sticky top-0 z-10 flex-none bg-beige">
          <Link href="/">
            <h1 className="px-4 py-3 text-xl font-bold">Recipe Scrap</h1>
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
