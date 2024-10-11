export const dynamic = "force-dynamic";

import type { ReactNode } from "react";

import { prisma } from "../../server/db";
import { authenticate } from "../authenticate";

export default async function Page(): Promise<ReactNode> {
  const user = await authenticate();
  const recipes = await prisma.recipe.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, steps: true, ingredients: { select: { name: true, amount: true } } },
  });

  return (
    <main className="grid h-screen w-full place-items-center">
      <div>
        {recipes.map((recipe) => (
          <div key={recipe.id}>
            <p>{recipe.name}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
