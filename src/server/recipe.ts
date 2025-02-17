import { isErr, unwrapErr, unwrapOk } from "option-t/plain_result";

import { structuralizeRecipe } from "./open-ai";
import { extractTextFromImage } from "./vision";
import { getVideoSnippet } from "./youtube";

async function importRecipeDetailsFromText(recipeId: string, text: string): Promise<void> {
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

export async function importRecipeDetails(recipeId: string): Promise<void> {
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

  await importRecipeDetailsFromText(recipeId, text);
}
