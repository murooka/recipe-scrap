import { test, expect } from "@playwright/test";

test("should navigate to the foo page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.getByText("Go to foo")).toBeVisible();
  await page.click("text=Go to foo");

  await expect(page).toHaveURL("http://localhost:3000/foo");
  await expect(page.getByText("This is foo")).toBeVisible();
});
