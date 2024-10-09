import "./globals.css";

import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
