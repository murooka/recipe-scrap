import { serialize } from "cookie";

export const COOKIE_NAME_GOOGLE_STATE = "app_gs";
export const COOKIE_NAME_SESSION = "app_s";

export function bakeCookie(
  name: string,
  value: string,
  path: string,
  sameSite: "strict" | "lax",
  expires?: Date,
): Record<string, string> {
  // TODO: use APP_ENV
  const secure = process.env.NODE_ENV === "production";
  return {
    "Set-Cookie": serialize(name, value, { path, httpOnly: true, secure, sameSite, expires }),
  };
}
