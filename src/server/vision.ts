import "server-only";

import vision from "@google-cloud/vision";

export async function extractText(): Promise<void> {
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.documentTextDetection(`gs://recipe-scrap-prod-vision-assets/IMG_8597.JPG`);
  console.log(result.fullTextAnnotation?.text);
}
