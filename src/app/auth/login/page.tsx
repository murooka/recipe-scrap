import Link from "next/link";
import type { ReactNode } from "react";

export default function Page(): ReactNode {
  return (
    <div>
      <Link href="/auth/google/login">Login with Google</Link>
    </div>
  );
}
