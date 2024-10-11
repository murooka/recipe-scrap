import type { Recipe } from "@prisma/client";

import type { User } from "../auth";
import { prisma } from "../db";
import { structuralizeRecipe } from "../open-ai";
import { upload } from "../storage";
import { extractText } from "../vision";

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

export async function getRecipes(): Promise<Recipe[]> {
  return prisma.recipe.findMany();
}
