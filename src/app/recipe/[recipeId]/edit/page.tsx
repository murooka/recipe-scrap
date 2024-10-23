import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { prisma } from "@facade/prisma";

import { authenticate } from "../../../authenticate";

import { Form } from "./Form";

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
      <Form recipe={recipe} />
    </main>
  );
}
