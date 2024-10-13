import type { ReactNode } from "react";

import { authenticate } from "../../authenticate";

import { action } from "./action";

export default async function Page(): Promise<ReactNode> {
  await authenticate();

  return (
    <main className="p-4">
      <form action={action} className="space-y-4">
        <input
          type="file"
          name="image"
          accept="image/*"
          className="block text-sm font-medium file:rounded-full file:border-none file:bg-pale file:px-4 file:py-2"
        />
        <button type="submit">登録</button>
      </form>
    </main>
  );
}
