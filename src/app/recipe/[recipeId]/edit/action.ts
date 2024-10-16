"use server";

import { redirect } from "next/navigation";

import { prisma } from "@facade/prisma";
import { updateRecipe } from "@facade/recipe";

import { authenticate } from "../../../authenticate";

export async function action(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id == null) throw new Error("empty_id");
  if (typeof id !== "string") throw new Error("invalid_id");

  console.log(formData);

  let thumbnail = formData.get("thumbnail") ?? undefined;
  if (typeof thumbnail === "string") throw new Error("invalid_thumbnail");
  if (thumbnail && thumbnail.size === 0) thumbnail = undefined;

  const recipe = await prisma.recipe.findUnique({ where: { id: id } });
  if (recipe == null) throw new Error("recipe_not_found");

  const user = await authenticate();
  if (recipe.userId !== user.id) throw new Error("unauthorized");

  await updateRecipe(user, id, { thumbnail });

  redirect(`/recipe/${id}`);
}
