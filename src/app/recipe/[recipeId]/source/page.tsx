import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { GcpImage } from "@components/gcp-image";
import { prisma } from "@facade/prisma";

import { authenticate } from "../../../authenticate";

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
      sourceImage: true,
      sourceYoutube: true,
    },
  });
  if (recipe == null) notFound();

  return (
    <main className="space-y-4 p-4">
      <h1 className="text-xl font-bold">{recipe.name}</h1>

      {recipe.sourceImage && (
        <section>
          <h2 className="font-bold">画像</h2>
          <GcpImage src={recipe.sourceImage.url} />
        </section>
      )}
      {recipe.sourceYoutube && (
        <section className="grid gap-y-2">
          <h2 className="font-bold">YouTube</h2>
          <iframe
            src={`https://www.youtube.com/embed/${recipe.sourceYoutube.videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="aspect-video w-full border-none"
          />
        </section>
      )}
    </main>
  );
}
