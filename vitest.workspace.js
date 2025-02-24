// @ts-check

import { defineProject, defineWorkspace } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineWorkspace([
  defineProject({
    test: {
      include: [`src/**/*.test.{ts,tsx}`],
      name: "unit",
      environment: "node",
      hookTimeout: 60_000,
    },
  }),
  defineProject({
    plugins: [react()],
    test: {
      include: [`src/**/*.test-browser.{ts,tsx}`],
      name: "browser",
      browser: {
        provider: "playwright",
        enabled: true,
        instances: [{ browser: "chromium" }],
        headless: true,
      },
    },
  }),
]);
