"use client";

import type { Recipe as PrismaRecipe, Ingredient as PrismaIngredient } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import type { ReactNode } from "react";

import { Button } from "@components/button";
import { Input } from "@components/input";
import { InputImage } from "@components/input-image";

import { deleteAction, reimportAction, updateAction } from "./action";

type Recipe = Pick<PrismaRecipe, "id" | "name" | "thumbnailUrl" | "steps"> & {
  ingredients: Pick<PrismaIngredient, "name" | "amount">[];
};

type FormProps = {
  recipe: Recipe;
};
export function Form(props: FormProps): ReactNode {
  const [, reimport, isReimportPending] = useActionState(reimportAction, null);
  return (
    <>
      <form action={updateAction}>
        <input type="hidden" name="id" value={props.recipe.id} />
        <InputImage name="thumbnail" defaultImageUrl={props.recipe.thumbnailUrl ?? undefined} />
        <div className="space-y-4 p-4">
          <Input type="text" name="name" defaultValue={props.recipe.name} />
          <div>
            <p className="font-bold">材料</p>
            <ul>
              {props.recipe.ingredients.map((ingredient) => (
                <li key={ingredient.name}>
                  {ingredient.name}: {ingredient.amount}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold">手順</p>
            <ol className="list-decimal pl-5">
              {props.recipe.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <Button type="submit">保存</Button>
        </div>
      </form>

      <div className="border-t p-4">
        <div className="flex gap-x-4">
          <form action={reimport}>
            <input type="hidden" name="id" value={props.recipe.id} />
            <Button type="submit" disabled={isReimportPending}>
              {isReimportPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              再取込み
            </Button>
          </form>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={props.recipe.id} />
            <Button type="submit">削除</Button>
          </form>
        </div>
      </div>
    </>
  );
}
