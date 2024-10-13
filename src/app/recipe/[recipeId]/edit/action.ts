"use server";

import { redirect } from "next/navigation";

import { prisma } from "@facade/prisma";
import { updateRecipeThumbnail } from "@facade/recipe";

import { authenticate } from "../../../authenticate";

export async function action(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id == null) throw new Error("empty_id");
  if (typeof id !== "string") throw new Error("invalid_id");

  const thumbnail = formData.get("thumbnail");
  if (thumbnail == null) throw new Error("empty_thumbnail");
  if (!(thumbnail instanceof File)) throw new Error("invalid_thumbnail");

  const recipe = await prisma.recipe.findUnique({ where: { id: id } });
  if (recipe == null) throw new Error("recipe_not_found");

  const user = await authenticate();
  if (recipe.userId !== user.id) throw new Error("unauthorized");

  await updateRecipeThumbnail(user, id, thumbnail);

  redirect(`/recipe/${id}`);
}
