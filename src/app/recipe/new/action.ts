"use server";

import { redirect } from "next/navigation";

import { createRecipeFromImage } from "@facade/recipe";

import { authenticate } from "../../authenticate";

type State = { ok: true } | { ok: false; error: string };
export async function action(_prevState: State, formData: FormData): Promise<State> {
  const user = await authenticate();

  const image = formData.get("image");
  if (image == null) return { ok: false, error: "画像を選択してください" };
  if (typeof image === "string") return { ok: false, error: "画像を選択してください" };

  await createRecipeFromImage(user, image);

  redirect("/");
}
