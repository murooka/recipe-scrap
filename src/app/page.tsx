export const dynamic = "force-dynamic";

import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

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
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <main className="relative space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipe.thumbnailUrl ?? "https://placehold.jp/192x192.png"}
                alt=""
                className="aspect-square object-cover"
              />
              <p className="font-medium">{recipe.name}</p>
            </Link>
          ))}
        </div>
      </main>
      <div className="fixed bottom-4 right-4">
        <Link href="/recipe/new" className="block rounded-full bg-primary p-3 text-white shadow hover:bg-primary/70">
          <Plus aria-label="新規レシピ" />
        </Link>
      </div>
    </>
  );
}
