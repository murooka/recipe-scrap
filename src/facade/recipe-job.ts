import { processRecipeJob as process } from "../server/recipe-job";

export async function processRecipeJob(recipeJobId: string): Promise<void> {
  await process(recipeJobId);
}
