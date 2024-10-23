import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Header } from "@components/header";

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
      <body>
        <div className="sticky top-0 z-10 border-b border-neutral-200">
          <div className="mx-auto max-w-screen-sm">
            <Header />
          </div>
        </div>
        <div className="mx-auto max-w-screen-sm">{children}</div>
      </body>
    </html>
  );
}
