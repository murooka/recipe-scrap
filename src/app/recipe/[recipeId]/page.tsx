import { ImageIcon, YoutubeIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@components/button";
import { GcpImage } from "@components/gcp-image";
import { prisma } from "@facade/prisma";

import { authenticate } from "../../authenticate";

type Props = {
  params: Promise<{ recipeId: string }>;
};

export default async function Page(props: Props): Promise<ReactNode> {
  const user = await authenticate();

  const { recipeId } = await props.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, userId: user.id, deletedAt: null },
    select: {
      id: true,
      name: true,
      thumbnailUrl: true,
      steps: true,
      ingredients: { select: { name: true, amount: true } },
      sourceImage: { select: { id: true } },
      sourceYoutube: { select: { id: true } },
    },
  });
  if (recipe == null) notFound();

  return (
    <main className="p-4">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href={`/recipe/${recipe.id}/edit`}>編集</Link>
        </Button>
      </div>
      {recipe.thumbnailUrl && (
        <GcpImage src={recipe.thumbnailUrl} alt="" className="mt-4 aspect-video w-full rounded object-cover" />
      )}
      <section className="mt-6 grid gap-y-6">
        <div className="items-stat flex justify-between gap-x-6">
          <h1 className="text-xl font-bold">{recipe.name}</h1>
          {recipe.sourceImage && (
            <Link href={`/recipe/${recipe.id}/source`}>
              <ImageIcon className="h-7 w-7 p-1" />
            </Link>
          )}
          {recipe.sourceYoutube && (
            <Link href={`/recipe/${recipe.id}/source`}>
              <YoutubeIcon className="h-7 w-7" />
            </Link>
          )}
        </div>
        <div>
          <p className="font-bold">材料</p>
          <ul className="mt-2 list-disc pl-5">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.name}>
                {ingredient.name}: {ingredient.amount}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold">手順</p>
          <ol className="mt-2 list-decimal pl-5">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
