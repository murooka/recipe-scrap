import { randomBytes } from "node:crypto";

export function createSecureRandomString(length: number): string {
  return randomBytes(length * 2)
    .toString("base64")
    .slice(0, length);
}
