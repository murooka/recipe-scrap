export const dynamic = "force-dynamic";

import Link from "next/link";
import type { ReactNode } from "react";

import { prisma } from "../server/db";

import { authenticate } from "./authenticate";

export default async function Home(): Promise<ReactNode> {
  const user = await authenticate();
  const recipes = await prisma.recipe.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, thumbnailUrl: true },
  });

  return (
    <main className="space-y-4 p-4">
      <div>
        <Link href="/recipe/new">新規</Link>
      </div>
      <div>
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={recipe.thumbnailUrl ?? "https://placehold.jp/192x192.png"} alt="" className="h-48 w-48" />
            <p>{recipe.name}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
