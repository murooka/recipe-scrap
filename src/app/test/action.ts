"use server";

import { extractText } from "../../server/vision";

export async function action(formData: FormData): Promise<void> {
  await extractText();
}
