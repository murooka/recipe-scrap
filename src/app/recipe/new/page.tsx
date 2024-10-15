import type { ReactNode } from "react";

import { Button } from "@components/button";

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
          className="block text-sm font-medium file:rounded-full file:border file:border-dark-100 file:bg-transparent file:px-4 file:py-2"
        />
        <Button type="submit">登録</Button>
      </form>
    </main>
  );
}
