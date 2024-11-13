"use server";

import { redirect } from "next/navigation";

import { prisma } from "@facade/prisma";
import { updateRecipe } from "@facade/recipe";

import { authenticate } from "../../../authenticate";

export async function updateAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id == null) throw new Error("empty_id");
  if (typeof id !== "string") throw new Error("invalid_id");

  console.log(formData);

  const name = formData.get("name");
  if (name == null) throw new Error("empty_name");
  if (typeof name !== "string") throw new Error("invalid_name");

  let thumbnail = formData.get("thumbnail") ?? undefined;
  if (typeof thumbnail === "string") throw new Error("invalid_thumbnail");
  if (thumbnail && thumbnail.size === 0) thumbnail = undefined;

  const recipe = await prisma.recipe.findUnique({ where: { id: id, deletedAt: null } });
  if (recipe == null) throw new Error("recipe_not_found");

  const user = await authenticate();
  if (recipe.userId !== user.id) throw new Error("unauthorized");

  await updateRecipe(user, id, { name, thumbnail });

  redirect(`/recipe/${id}`);
}

export async function deleteAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id == null) throw new Error("empty_id");
  if (typeof id !== "string") throw new Error("invalid_id");

  const recipe = await prisma.recipe.findUnique({ where: { id: id, deletedAt: null } });
  if (recipe == null) throw new Error("recipe_not_found");

  const user = await authenticate();
  if (recipe.userId !== user.id) throw new Error("unauthorized");

  await prisma.recipe.update({ where: { id: id }, data: { deletedAt: new Date() } });

  redirect("/recipe");
}
