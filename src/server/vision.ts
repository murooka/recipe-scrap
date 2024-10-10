import vision from "@google-cloud/vision";

export async function extractText(): Promise<string> {
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.documentTextDetection(`gs://recipe-scrap-prod-vision-assets/IMG_8597.JPG`);
  console.dir(result, { depth: null });
  return result.fullTextAnnotation?.text ?? "";
}
