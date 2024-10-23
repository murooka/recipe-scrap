"use server";

import { redirect } from "next/navigation";
import { createErr } from "option-t/plain_result";
import type { Result } from "option-t/plain_result";
import { z } from "zod";

import { createRecipeFromImage, createRecipeFromYoutube } from "@facade/recipe";

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

const videoIdPattern = /^[0-9A-Za-z_-]{11}$/;
function extractYoutubeVideoId(urlOrId: string) {
  const s = urlOrId.trim();
  if (s.match(videoIdPattern)) return s;

  try {
    const url = new URL(s);
    const v = url.searchParams.get("v");
    if (v && v.match(videoIdPattern)) return v;

    return null;
  } catch (_e: unknown) {
    return null;
  }
}

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
  } else if (params.sourceType === "youtube") {
    const videoId = extractYoutubeVideoId(params.sourceYoutubeUrl);
    if (videoId == null) return createErr("YouTubeのURLまたはIDを入力してください");
    await createRecipeFromYoutube(user, videoId);
  }

  redirect("/");
}
