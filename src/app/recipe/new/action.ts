"use server";

import { redirect } from "next/navigation";
import { createErr } from "option-t/plain_result";
import type { Result } from "option-t/plain_result";

import { createRecipeFromImage } from "@facade/recipe";

import { authenticate } from "../../authenticate";

type State = Result<null, string>;
export async function action(_prevState: State, formData: FormData): Promise<State> {
  const user = await authenticate();

  const sourceImage = formData.get("sourceImage");
  if (sourceImage == null) return createErr("レシピ画像を選択してください");
  if (typeof sourceImage === "string") return createErr("レシピ画像を選択してください");

  await createRecipeFromImage(user, sourceImage);

  redirect("/");
}
