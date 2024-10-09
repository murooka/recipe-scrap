// @ts-check
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testMatch: "src/**/*.e2e.ts",
  webServer: {
    command: "pnpm run dev:next",
    url: "http://localhost:3000",
  },
});
