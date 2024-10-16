"use client";

import { Loader2 } from "lucide-react";
import { createOk, isOk } from "option-t/plain_result";
import type { ReactNode } from "react";
import { useActionState } from "react";

import { Button } from "@components/button";

import { action } from "./action";

type FormProps = unknown;
export function Form(_props: FormProps): ReactNode {
  const [state, submitAction, isPending] = useActionState(action, createOk(null));
  return (
    <form action={submitAction} className="space-y-4">
      <input
        type="file"
        name="image"
        accept="image/*"
        className="block text-sm font-medium file:rounded-full file:border file:border-secondary file:bg-transparent file:px-4 file:py-2"
      />
      {isOk(state) ? null : <p>{state.err}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        登録
      </Button>
    </form>
  );
}
