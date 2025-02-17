import type { Result } from "option-t/plain_result";
import { createErr, createOk, isErr, unwrapErr, unwrapOk } from "option-t/plain_result";

import { assertNever } from "../lib/utils";

import { structuralizeRecipe } from "./open-ai";
import { extractTextFromImage } from "./vision";
import { getVideoSnippet } from "./youtube";

async function importRecipeDetailsFromText(
  recipeId: string,
  text: string,
): Promise<Result<true, "structuralize_failed">> {
  const res = await structuralizeRecipe(text);
  if (isErr(res)) {
    const err = unwrapErr(res);
    switch (err) {
      case "empty_response":
      case "invalid_response":
        return createErr("structuralize_failed");
      default:
        return assertNever(err);
    }
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

  return createOk(true);
}

export async function importRecipeDetails(recipeId: string): Promise<Result<true, "structuralize_failed">> {
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
    text = await extractTextFromImage(recipe.sourceImage.url);
  } else if (recipe.sourceYoutube) {
    const video = await getVideoSnippet(recipe.sourceYoutube.videoId);
    if (!video) throw new Error(`failed to get video for recipe ${recipe.id}`);

    text = video.title + "\n" + video.description;
  } else {
    throw new Error(`no source for recipe ${recipe.id}`);
  }

  const result = await importRecipeDetailsFromText(recipeId, text);
  if (isErr(result)) {
    return result;
  }

  return createOk(true);
}
