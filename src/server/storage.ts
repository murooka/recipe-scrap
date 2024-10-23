import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream } from "node:stream/web";

import { Storage } from "@google-cloud/storage";
import { nanoid } from "nanoid";

import type { User } from "./auth";

const bucketName = process.env.GCS_PUBLIC_BUCKET_NAME;

export async function uploadUserImage(user: User, file: File): Promise<string> {
  const storage = new Storage();

  const id = nanoid();
  const storageFile = storage.bucket(bucketName).file(`${user.id}/${id}/${file.name}`);

  const readable = Readable.fromWeb(file.stream() as ReadableStream);
  const writable = storageFile.createWriteStream();
  await pipeline(readable, writable);

  return storageFile.publicUrl();
}
