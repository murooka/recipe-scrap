import vision from "@google-cloud/vision";

export async function extractText(url: string): Promise<string> {
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.documentTextDetection(url);
  return result.fullTextAnnotation?.text ?? "";
}
