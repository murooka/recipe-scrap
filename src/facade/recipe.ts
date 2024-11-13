import "server-only";

import type { Recipe } from "@prisma/client";
import type { Result } from "option-t/plain_result";
import { createErr, createOk, isErr, unwrapErr, unwrapOk } from "option-t/plain_result";

import type { User } from "../server/auth";
import { prisma } from "../server/db";
import { structuralizeRecipe } from "../server/open-ai";
import { uploadUserImage } from "../server/storage";
import { extractText } from "../server/vision";
import { getVideoSnippet } from "../server/youtube";

async function extract(recipeId: string, url: string): Promise<void> {
  const text = await extractText(url);
  const res = await structuralizeRecipe(text);
  if (isErr(res)) {
    console.log(unwrapErr(res));
    throw new Error("server_error");
  }

  const recipe = unwrapOk(res);

  await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      name: recipe.name,
      ingredients: {
        deleteMany: {},
        createMany: { data: recipe.ingredients },
      },
      steps: recipe.steps,
    },
  });
}

export async function createRecipeFromImage(user: User, thumbnail: File | null, source: File): Promise<void> {
  const [sourceUrl, thumbnailUrl] = await Promise.all([
    uploadUserImage(user, source),
    thumbnail ? uploadUserImage(user, thumbnail) : Promise.resolve(null),
  ]);

  const recipe = await prisma.recipe.create({
    data: {
      name: "",
      ingredients: {},
      steps: [],
      thumbnailUrl: thumbnailUrl,
      user: { connect: { id: user.id } },
      RecipeSourceImage: { create: { url: sourceUrl } },
    },
  });

  await extract(recipe.id, sourceUrl);
}

function uniqueBy<T>(arr: T[], key: (item: T) => string): T[] {
  const map = new Map<string, T>();
  for (const item of arr) map.set(key(item), item);
  return [...map.values()];
}

export async function createRecipeFromYoutube(user: User, videoId: string): Promise<Result<null, string>> {
  const video = await getVideoSnippet(videoId);
  if (!video) return createErr("failed_to_get_video");

  const res = await structuralizeRecipe(video.title + "\n" + video.description);
  if (isErr(res)) return res;

  const recipe = unwrapOk(res);
  console.dir(recipe, { depth: null });

  await prisma.recipe.create({
    data: {
      name: recipe.name,
      user: { connect: { id: user.id } },
      thumbnailUrl: video.thumbnailUrl,
      ingredients: {
        createMany: { data: uniqueBy(recipe.ingredients, (v) => v.name) },
      },
      steps: recipe.steps,
      RecipeSourceYoutube: { create: { videoId } },
    },
  });

  return createOk(null);
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
