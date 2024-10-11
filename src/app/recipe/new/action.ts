"use server";

import { structuralizeRecipe } from "../../../server/open-ai";
import { extractText } from "../../../server/vision";

export async function action(_formData: FormData): Promise<void> {
  const text = await extractText();
  const res = await structuralizeRecipe(text);
  if (res.isErr()) {
    return;
  }

  console.dir(res.value, { depth: null });
}
