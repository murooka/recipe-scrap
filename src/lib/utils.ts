import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function uniqueBy<T>(arr: T[], key: (item: T) => string): T[] {
  const map = new Map<string, T>();
  for (const item of arr) map.set(key(item), item);
  return [...map.values()];
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
