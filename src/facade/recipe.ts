import "server-only";

import type { Recipe } from "@prisma/client";
import { isErr } from "option-t/plain_result";

import type { User } from "../server/auth";
import { prisma } from "../server/db";
import { structuralizeRecipe } from "../server/open-ai";
import { uploadVisionImage, uploadUserImage } from "../server/storage";
import { extractText } from "../server/vision";

async function extract(recipeId: string, url: string): Promise<void> {
  const text = await extractText(url);
  const res = await structuralizeRecipe(text);
  if (isErr(res)) {
    console.log(res.err);
    throw new Error("server_error");
  }

  const recipe = res.val;

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
    uploadVisionImage(source),
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

export async function updateRecipe(user: User, recipeId: string, params: { thumbnail?: File }): Promise<void> {
  const thumbnailUrl = await (params.thumbnail ? uploadUserImage(user, params.thumbnail) : Promise.resolve(undefined));
  await prisma.recipe.update({
    where: { id: recipeId },
    data: { thumbnailUrl },
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
  return prisma.recipe.findMany();
}
