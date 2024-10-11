import type { ReactNode } from "react";

import { authenticate } from "../../authenticate";

import { action } from "./action";

export default async function Page(): Promise<ReactNode> {
  await authenticate();

  return (
    <main className="grid h-screen w-full place-items-center">
      <div>
        <form action={action}>
          <input type="file" name="image" accept="image/*" />
          <br />
          <button type="submit">登録</button>
        </form>
      </div>
    </main>
  );
}
