import type { Recipe } from "@prisma/client";

import type { User } from "../server/auth";
import { prisma } from "../server/db";
import { structuralizeRecipe } from "../server/open-ai";
import { upload, uploadUserImage } from "../server/storage";
import { extractText } from "../server/vision";

async function extract(recipeId: string, url: string): Promise<void> {
  const text = await extractText(url);
  const res = await structuralizeRecipe(text);
  if (res.isErr()) {
    console.log(res.error);
    throw new Error("server_error");
  }

  const recipe = res.value;

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

export async function createRecipeFromImage(user: User, image: File): Promise<void> {
  const url = await upload(image);
  console.log(url);

  const recipe = await prisma.recipe.create({
    data: {
      name: "",
      ingredients: {},
      steps: [],
      user: { connect: { id: user.id } },
      RecipeSourceImage: { create: { url } },
    },
  });

  await extract(recipe.id, url);
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
