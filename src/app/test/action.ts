"use server";

import { extractText } from "../../server/vision";

export async function action(_formData: FormData): Promise<void> {
  await extractText();
}
