"use server";

import { createRecipeFromImage } from "@facade/recipe";

import { authenticate } from "../../authenticate";

export async function action(formData: FormData): Promise<void> {
  const user = await authenticate();

  const image = formData.get("image");
  if (image == null) throw new Error("image_is_empty");
  if (typeof image === "string") throw new Error("invalid_image");

  await createRecipeFromImage(user, image);
}
