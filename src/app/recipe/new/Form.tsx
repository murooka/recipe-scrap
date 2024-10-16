"use client";

import { Loader2 } from "lucide-react";
import { createOk, isOk } from "option-t/plain_result";
import type { ReactNode } from "react";
import { useActionState } from "react";

import { Button } from "@components/button";
import { InputFile } from "@components/input-file";

import { action } from "./action";

type FormProps = unknown;
export function Form(_props: FormProps): ReactNode {
  const [state, submitAction, isPending] = useActionState(action, createOk(null));

  return (
    <form action={submitAction}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sourceImage" className="text-sm font-bold">
            レシピ画像
          </label>
          <InputFile id="sourceImage" name="sourceImage" required />
        </div>
        {isOk(state) ? null : <p>{state.err}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          登録
        </Button>
      </div>
    </form>
  );
}
