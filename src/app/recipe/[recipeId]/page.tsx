import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@components/button";
import { Header } from "@components/header";
import { prisma } from "@facade/prisma";

import { authenticate } from "../../authenticate";

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
    <>
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <main>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {recipe.thumbnailUrl && <img src={recipe.thumbnailUrl} alt="" className="aspect-[4/3] w-full object-cover" />}
        <section className="space-y-4 p-4">
          <h1 className="text-xl font-medium">{recipe.name}</h1>
          <div>
            <Button asChild variant="outline">
              <Link href={`/recipe/${recipe.id}/edit`}>編集</Link>
            </Button>
          </div>
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
        </section>
      </main>
    </>
  );
}
