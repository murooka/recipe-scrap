import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Ingredient = {
  name: string;
  amount: string;
};
type Recipe = {
  name: string;
  ingredients: Ingredient[];
  steps: string[];
};

// structuralizeRecipe は、SNSなどで共有されたレシピのテキストをChatGPTを用いて構造化します。
export async function structuralizeRecipe(
  text: string,
): Promise<Result<Recipe, "empty_response" | "invalid_response">> {
  const content = `
料理のレシピが書かれたテキストをお渡ししますので、それをJSON形式に変換してください。
お渡しするテキストはOCRを利用したため不正確であったり、レシピの記載順序が入れ替わってしまっている可能性があることに気をつけてください。。
返事にJSON以外のテキストは含めず、JSONは以下のJSON Schemaを満たす形にしてください。
\`\`\`json
{
  "$schema": "http://json-schema.org/draft-06/schema#",
  "$ref": "#/definitions/Recipe",
  "definitions": {
    "Ingredient": {
      "title": "Ingredient",
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "amount": { "type": "string" }
      }
    }
  },
  "title": "Recipe",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "ingredients": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Ingredient"
      }
    },
    "steps": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
\`\`\`
入力テキストは以下のとおりです。
----
${text}
  `.trim();

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content }],
  });
  const message = res.choices[0].message.content;
  if (message == null) {
    console.dir(res, { depth: null });
    return err("empty_response");
  }

  try {
    let json = message;
    json = json.replace(/^```\w*/g, "");
    json = json.replace(/```$/g, "");
    const recipe: Recipe = JSON.parse(json);
    return ok(recipe);
  } catch (e) {
    console.error("invalid json", { e, message });
    return err("invalid_response");
  }
}
