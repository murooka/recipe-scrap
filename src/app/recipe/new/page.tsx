import type { ReactNode } from "react";

import { authenticate } from "../../authenticate";

import { Form } from "./Form";

export default async function Page(): Promise<ReactNode> {
  await authenticate();

  return (
    <main className="p-4">
      <Form />
    </main>
  );
}
