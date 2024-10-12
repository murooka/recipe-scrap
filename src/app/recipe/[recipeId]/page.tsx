import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { prisma } from "../../../server/db";
import { authenticate } from "../../authenticate";

type Props = {
  params: { recipeId: string };
};

export default async function Page(props: Props): Promise<ReactNode> {
  const user = await authenticate();

  const recipe = await prisma.recipe.findUnique({
    where: { id: props.params.recipeId, userId: user.id },
    select: { id: true, name: true, steps: true, ingredients: { select: { name: true, amount: true } } },
  });
  if (recipe == null) notFound();

  return (
    <main className="space-y-4 p-4">
      <h1>{recipe.name}</h1>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.name}>
            {ingredient.name}: {ingredient.amount}
          </li>
        ))}
      </ul>
      <ol className="list-decimal pl-5">
        {recipe.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </main>
  );
}
