export const dynamic = "force-dynamic";

import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@components/button";
import { GcpImage } from "@components/gcp-image";
import { Header } from "@components/header";
import { prisma } from "@facade/prisma";

import { authenticate } from "./authenticate";

export default async function Home(): Promise<ReactNode> {
  const user = await authenticate();
  const recipes = await prisma.recipe.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, thumbnailUrl: true },
  });

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-neutral-200">
        <Header />
      </div>
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
        <div className="grid grid-cols-1 gap-4">
          {[...recipes, ...recipes, ...recipes, ...recipes, ...recipes, ...recipes, ...recipes, ...recipes].map(
            (recipe) => (
              <div key={recipe.id} className="overflow-hidden rounded border border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <GcpImage
                  src={recipe.thumbnailUrl ?? "https://placehold.jp/192x192.png"}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
                <div className="grid gap-y-4 p-4">
                  <p className="text-lg font-bold">{recipe.name}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/recipe/${recipe.id}`}>
                      <p className="font-medium">{recipe.name}</p>
                    </Link>
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      </main>
    </>
  );
}
