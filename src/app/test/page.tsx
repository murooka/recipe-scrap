import type { ReactNode } from "react";

import { action } from "./action";

export default function Page(): ReactNode {
  return (
    <div>
      <form action={action}>
        <button type="submit">Test</button>
      </form>
    </div>
  );
}
