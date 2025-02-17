import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@components/button";

export default function Page(): ReactNode {
  return (
    <div className="grid h-64 place-items-center">
      <Button asChild>
        <Link href="/auth/google/login">Login with Google</Link>
      </Button>
    </div>
  );
}
