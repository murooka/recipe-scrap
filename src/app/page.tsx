export const dynamic = "force-dynamic";

import { ImageIcon, Plus, YoutubeIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@components/button";
import { GcpImage } from "@components/gcp-image";
import { prisma } from "@facade/prisma";

import { authenticate } from "./authenticate";

export default async function Home(): Promise<ReactNode> {
  const user = await authenticate();
  const recipes = await prisma.recipe.findMany({
    where: { userId: user.id, deletedAt: null },
    select: {
      id: true,
      name: true,
      thumbnailUrl: true,
      sourceImage: { select: { id: true } },
      sourceYoutube: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="relative space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">最新のレシピ</h1>
        <Button asChild>
          <Link href="/recipe/new">
            <Plus className="mr-2 h-4 w-4" />
            レシピを追加
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="grid grid-cols-[96px_1fr] gap-x-4">
            <Link href={`/recipe/${recipe.id}`}>
              <GcpImage
                src={recipe.thumbnailUrl ?? "https://placehold.jp/192x192.png"}
                alt=""
                className="aspect-square w-full rounded-xl object-cover"
              />
            </Link>
            <div className="grid">
              <Link href={`/recipe/${recipe.id}`}>
                <h3 className="text-lg font-bold">{recipe.name}</h3>{" "}
              </Link>
              <div>
                {recipe.sourceImage && (
                  <Link href={`/recipe/${recipe.id}/source`}>
                    <ImageIcon className="h-8 w-8 p-1" />
                  </Link>
                )}
                {recipe.sourceYoutube && (
                  <Link href={`/recipe/${recipe.id}/source`}>
                    <YoutubeIcon className="h-7 w-7" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
