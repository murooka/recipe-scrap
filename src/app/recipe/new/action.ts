"use server";

import { structuralizeRecipe } from "../../../server/open-ai";
import { upload } from "../../../server/storage";
import { extractText } from "../../../server/vision";

export async function action(formData: FormData): Promise<void> {
  const image = formData.get("image");
  if (image == null) throw new Error("image_is_empty");
  if (typeof image === "string") throw new Error("invalid_image");

  const url = await upload(image);
  console.log(url);

  const text = await extractText(url);
  const res = await structuralizeRecipe(text);
  if (res.isErr()) {
    console.log(res.error);
    throw new Error("server_error");
  }

  const recipe = res.value;
  console.dir(recipe, { depth: null });
}
