import type { RecipeJob } from "@prisma/client";
import type { Result } from "option-t/plain_result";
import { createErr, createOk, isErr, unwrapErr } from "option-t/plain_result";

import { assertNever } from "../lib/utils";

import { prisma } from "./db";
import { importRecipeDetails } from "./recipe";

type RecipeJobContext = {
  type: "import";
};

export async function createImportRecipeJob(recipeId: string): Promise<RecipeJob> {
  const context = JSON.stringify({
    type: "import",
  } satisfies RecipeJobContext);

  return await prisma.recipeJob.create({
    data: { recipeId, context },
  });
}

async function processRecipeJobImpl(recipeJob: RecipeJob): Promise<Result<true, string>> {
  const context = JSON.parse(recipeJob.context) as RecipeJobContext;

  try {
    switch (context.type) {
      case "import": {
        const result = await importRecipeDetails(recipeJob.recipeId);
        if (isErr(result)) return result;
        break;
      }
      default:
        assertNever(context.type);
    }
  } catch (e: unknown) {
    const reason = `${e}`;
    return createErr(reason);
  }

  return createOk(true);
}

export async function processRecipeJob(recipeJobId: string): Promise<void> {
  const recipeJob = await prisma.recipeJob.findUniqueOrThrow({ where: { id: recipeJobId } });
  const result = await processRecipeJobImpl(recipeJob);
  if (isErr(result)) {
    const reason = unwrapErr(result);
    await prisma.recipeJobFailed.create({ data: { recipeJobId, reason } });
    return;
  }

  await prisma.recipeJobCompleted.create({ data: { recipeJobId } });
}
