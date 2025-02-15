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

async function importDetailsFromText(recipeId: string, text: string): Promise<void> {
  const res = await structuralizeRecipe(text);
  if (isErr(res)) {
    console.log(unwrapErr(res));
    throw new Error("server_error");
  }

  const structuralized = unwrapOk(res);

  await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      name: structuralized.name,
      ingredients: {
        deleteMany: {},
        createMany: { data: structuralized.ingredients },
      },
      steps: structuralized.steps,
    },
  });
}

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

  const text = await extractText(sourceUrl);
  await importDetailsFromText(createdRecipe.id, text);
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

  const video = await getVideoSnippet(videoId);
  if (!video) return createErr("failed_to_get_video");

  const text = video.title + "\n" + video.description;
  await importDetailsFromText(createdRecipe.id, text);

  return createOk(null);
}

export async function reimportRecipeDetails(recipeId: string): Promise<void> {
  const recipe = await prisma.recipe.findUniqueOrThrow({
    where: { id: recipeId },
    select: {
      id: true,
      sourceImage: true,
      sourceYoutube: true,
    },
  });

  let text: string;
  if (recipe.sourceImage) {
    text = await extractText(recipe.sourceImage.url);
  } else if (recipe.sourceYoutube) {
    const video = await getVideoSnippet(recipe.sourceYoutube.videoId);
    if (!video) throw new Error(`failed to get video for recipe ${recipe.id}`);

    text = video.title + "\n" + video.description;
  } else {
    throw new Error(`no source for recipe ${recipe.id}`);
  }

  await importDetailsFromText(recipeId, text);
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
