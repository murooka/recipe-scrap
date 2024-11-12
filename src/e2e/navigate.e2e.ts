import { test, expect } from "@playwright/test";

test("should navigate to the login page", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.waitForURL("http://localhost:3000/auth/login");
  await expect(page.getByText("Login with Google")).toBeVisible();
});
