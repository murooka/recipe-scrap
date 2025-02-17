import "server-only";

import type { Recipe } from "@prisma/client";
import type { Result } from "option-t/plain_result";
import { createOk } from "option-t/plain_result";

import type { User } from "../server/auth";
import { prisma } from "../server/db";
import { importRecipeDetails } from "../server/recipe";
import { uploadUserImage } from "../server/storage";

export async function createRecipeFromImage(user: User, thumbnail: File | null, source: File): Promise<void> {
  const [sourceUrl, thumbnailUrl] = await Promise.all([
    uploadUserImage(user, source),
    thumbnail ? uploadUserImage(user, thumbnail) : Promise.resolve(null),
  ]);

  const createdRecipe = await prisma.recipe.create({
    data: {
      name: "",
      ingredients: {},
      steps: [],
      thumbnailUrl: thumbnailUrl,
      user: { connect: { id: user.id } },
      sourceImage: { create: { url: sourceUrl } },
    },
  });

  await importRecipeDetails(createdRecipe.id);
}

export async function createRecipeFromYoutube(user: User, videoId: string): Promise<Result<null, string>> {
  const createdRecipe = await prisma.recipe.create({
    data: {
      name: "",
      thumbnailUrl: null,
      steps: [],
      user: { connect: { id: user.id } },
      sourceYoutube: { create: { videoId } },
    },
  });

  await importRecipeDetails(createdRecipe.id);

  return createOk(null);
}

export async function reimportRecipeDetails(recipeId: string): Promise<void> {
  await importRecipeDetails(recipeId);
}

export async function updateRecipe(
  user: User,
  recipeId: string,
  params: { name: string; thumbnail?: File },
): Promise<void> {
  const thumbnailUrl = await (params.thumbnail ? uploadUserImage(user, params.thumbnail) : Promise.resolve(undefined));
  await prisma.recipe.update({
    where: { id: recipeId },
    data: { name: params.name, thumbnailUrl },
  });
}

export async function updateRecipeThumbnail(user: User, recipeId: string, thumbnail: File): Promise<void> {
  const thumbnailUrl = await uploadUserImage(user, thumbnail);
  await prisma.recipe.update({
    where: { id: recipeId },
    data: { thumbnailUrl },
  });
}

export async function getRecipes(): Promise<Recipe[]> {
  return prisma.recipe.findMany({ where: { deletedAt: null } });
}
