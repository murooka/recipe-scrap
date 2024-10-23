"use server";

import { redirect } from "next/navigation";
import { createErr } from "option-t/plain_result";
import type { Result } from "option-t/plain_result";
import { z } from "zod";

import { createRecipeFromImage } from "@facade/recipe";

import { authenticate } from "../../authenticate";

const optionalFileSchema = z
  .custom<File>()
  .optional()
  .refine((file) => file && file.type.startsWith("image/"), { message: "画像ファイルを選択してください" })
  .refine((file) => file && file.size < 5_000_000, { message: "5MB以下の画像ファイルを選択してください" });
const fileSchema = z
  .custom<File>()
  .refine((file) => file && file.type.startsWith("image/"), { message: "画像ファイルを選択してください" })
  .refine((file) => file && file.size < 5_000_000, { message: "5MB以下の画像ファイルを選択してください" });

const schema = z.union([
  z.object({
    sourceType: z.literal("image"),
    sourceImage: fileSchema,
    thumbnailImage: optionalFileSchema,
  }),
  z.object({
    sourceType: z.literal("youtube"),
    sourceYoutubeUrl: z.string(),
  }),
]);

type State = Result<null, string>;
export async function action(_prevState: State, formData: FormData): Promise<State> {
  const user = await authenticate();

  const keys = ["sourceType", "sourceImage", "thumbnailImage", "sourceYoutubeUrl"];
  const rawParams: Record<string, unknown> = {};
  for (const key of keys) rawParams[key] = formData.get(key);

  const parseResult = await schema.safeParseAsync(rawParams);
  if (!parseResult.success) {
    console.log(parseResult.error);
    return createErr(parseResult.error.toString());
  }

  const params = parseResult.data;

  if (params.sourceType === "image") {
    await createRecipeFromImage(user, params.thumbnailImage ?? null, params.sourceImage);
  }

  redirect("/");
}
