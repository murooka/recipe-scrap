"use client";

import type { Recipe as PrismaRecipe, Ingredient as PrismaIngredient } from "@prisma/client";
import type { ReactNode } from "react";

import { Button } from "@components/button";
import { Input } from "@components/input";
import { InputImage } from "@components/input-image";

import { action } from "./action";

type Recipe = Pick<PrismaRecipe, "id" | "name" | "thumbnailUrl" | "steps"> & {
  ingredients: Pick<PrismaIngredient, "name" | "amount">[];
};

type FormProps = {
  recipe: Recipe;
};
export function Form(props: FormProps): ReactNode {
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form action={action}>
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
  );
}
