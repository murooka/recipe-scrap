import OpenAI from "openai";
import { createErr, createOk } from "option-t/plain_result";
import type { Result } from "option-t/plain_result";

type Ingredient = {
  name: string;
  amount: string;
};
export type Recipe = {
  name: string;
  ingredients: Ingredient[];
  steps: string[];
};

// structuralizeRecipe は、SNSなどで共有されたレシピのテキストをChatGPTを用いて構造化します。
export async function structuralizeRecipe(
  text: string,
): Promise<Result<Recipe, "empty_response" | "invalid_response">> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const content = `
料理のレシピが書かれたテキストをお渡ししますので、それをJSON形式に変換してください。
お渡しするテキストは日本語が不正確であったり、レシピ以外の情報が混ざっていたり、レシピの記載順序が入れ替わってしまっている可能性があることに気をつけてください。
また、1つの手順が極端に長い場合は、不自然でない範囲で適宜分割してください。
返事にJSON以外のテキストは含めず、JSONは以下のフォーマットにしてください。
\`\`\`json
{
  name: "料理名",
  ingredients: [
    { name: "材料名", amount: "分量" },
    ...
  ],
  steps: [
    "手順1",
    ...
  ]
}
\`\`\`
入力テキストは以下のとおりです。
----
${text}
  `.trim();

  console.log(content);
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content }],
  });
  console.dir(res.choices, { depth: null });
  const message = res.choices[0].message.content;
  if (message == null) {
    return createErr("empty_response");
  }

  try {
    let json = message;
    json = json.replace(/^```\w*/g, "");
    json = json.replace(/```$/g, "");
    const recipe: Recipe = JSON.parse(json);
    return createOk(recipe);
  } catch (e) {
    console.error("invalid json", { e, message });
    return createErr("invalid_response");
  }
}
