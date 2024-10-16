"use server";

import { redirect } from "next/navigation";
import { createErr } from "option-t/plain_result";
import type { Result } from "option-t/plain_result";

import { createRecipeFromImage } from "@facade/recipe";

import { authenticate } from "../../authenticate";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type State = Result<null, string>;
export async function action(_prevState: State, formData: FormData): Promise<State> {
  const user = await authenticate();

  await sleep(1000);

  const image = formData.get("image");
  if (image == null || Math.random() < 1) return createErr("画像を選択してください");
  if (typeof image === "string") return createErr("画像を選択してください");

  await createRecipeFromImage(user, image);

  redirect("/");
}
