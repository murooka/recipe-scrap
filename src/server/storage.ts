import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream } from "node:stream/web";

import { Storage } from "@google-cloud/storage";

import type { User } from "./auth";

export async function upload(file: File): Promise<string> {
  const storage = new Storage();

  const uuid = randomUUID();
  const storageFile = storage.bucket("recipe-scrap-prod-vision-assets").file(`${uuid}/${file.name}`);
  console.log(storageFile.name);

  const readable = Readable.fromWeb(file.stream() as ReadableStream);
  const writable = storageFile.createWriteStream();
  await pipeline(readable, writable);

  return storageFile.cloudStorageURI.href;
}

export async function uploadUserImage(user: User, file: File): Promise<string> {
  const storage = new Storage();

  const uuid = randomUUID();
  const storageFile = storage.bucket("recipe-scrap-prod-user-assets").file(`${user.id}/${uuid}/${file.name}`);

  const readable = Readable.fromWeb(file.stream() as ReadableStream);
  const writable = storageFile.createWriteStream();
  await pipeline(readable, writable);

  return storageFile.publicUrl();
}
