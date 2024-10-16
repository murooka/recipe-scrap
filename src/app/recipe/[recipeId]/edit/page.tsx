import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@components/button";
import { prisma } from "@facade/prisma";

import { authenticate } from "../../../authenticate";

import { action } from "./action";

type Props = {
  params: Promise<{ recipeId: string }>;
};

export default async function Page(props: Props): Promise<ReactNode> {
  const user = await authenticate();

  const { recipeId } = await props.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, userId: user.id },
    select: {
      id: true,
      name: true,
      thumbnailUrl: true,
      steps: true,
      ingredients: { select: { name: true, amount: true } },
    },
  });
  if (recipe == null) notFound();

  return (
    <main>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {recipe.thumbnailUrl && <img src={recipe.thumbnailUrl} alt="" className="aspect-[4/3] w-full object-cover" />}
      <div className="p-4">
        <input
          type="file"
          name="thumbnail"
          className="block text-sm font-medium file:rounded-full file:border file:border-secondary file:bg-transparent file:px-4 file:py-2"
        />
      </div>
      <form action={action} className="p-4">
        <input type="hidden" name="id" value={recipe.id} />
        <div className="space-y-4">
          <h1 className="text-xl font-medium">{recipe.name}</h1>
          <div>
            <p className="font-bold">材料</p>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.name}>
                  {ingredient.name}: {ingredient.amount}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold">手順</p>
            <ol className="list-decimal pl-5">
              {recipe.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </main>
  );
}
