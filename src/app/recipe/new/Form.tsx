"use client";

import { Loader2 } from "lucide-react";
import { createOk, isOk, unwrapErr } from "option-t/plain_result";
import type { ReactNode } from "react";
import { useActionState, useState } from "react";

import { Button } from "@components/button";
import { Input } from "@components/input";
import { InputImage } from "@components/input-image";
import { RadioGroup, RadioGroupItem } from "@components/radio-group";

import { action } from "./action";

type SourceType = "image" | "youtube";

type FormProps = unknown;
export function Form(_props: FormProps): ReactNode {
  const [sourceType, setSourceType] = useState<SourceType>("image");
  const [state, submitAction, isPending] = useActionState(action, createOk(null));

  return (
    <form action={submitAction}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sourceImage" className="text-sm font-bold">
            ソース
          </label>
          <RadioGroup name="sourceType" defaultValue="image" onValueChange={(v) => setSourceType(v as SourceType)}>
            <div className="flex items-center gap-x-2">
              <RadioGroupItem id="source-type-image" value="image" />
              <label htmlFor="source-type-image">画像</label>
            </div>
            <div className="flex items-center gap-x-2">
              <RadioGroupItem id="source-type-youtube" value="youtube" />
              <label htmlFor="source-type-youtube">YouTube</label>
            </div>
          </RadioGroup>
        </div>
        {sourceType === "image" && (
          <>
            <div className="space-y-2">
              <label htmlFor="sourceImage" className="text-sm font-bold">
                レシピ画像
              </label>
              <InputImage id="sourceImage" name="sourceImage" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="thumbnailImage" className="space-x-2 text-sm font-bold">
                <span>サムネイル画像</span>
                <small className="font-normal text-neutral-800">任意</small>
              </label>
              <InputImage id="thumbnailImage" name="thumbnailImage" />
            </div>
          </>
        )}
        {sourceType === "youtube" && (
          <>
            <div className="space-y-2">
              <label htmlFor="sourceYoutubeUrl" className="text-sm font-bold">
                URL
              </label>
              <Input id="sourceYoutubeUrl" name="sourceYoutubeUrl" />
            </div>
          </>
        )}
        {isOk(state) ? null : <p>{unwrapErr(state)}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          登録
        </Button>
      </div>
    </form>
  );
}
