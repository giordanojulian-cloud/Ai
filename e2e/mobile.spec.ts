import { expect, test } from "@playwright/test";

test.describe("mobile", () => {
  test("menu opens and navigates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Debt", exact: true }).click();
    await expect(page).toHaveURL(/\/category\/debt$/);
  });

  test("search is reachable from the header", async ({ page }) => {
    await page.goto("/calculator/tip");
    await page.getByRole("button", { name: "Search calculators" }).click();
    await page.getByRole("combobox").fill("cap rate");
    await expect(page.getByRole("option").first()).toContainText("Cap Rate");
  });

  test("layout does not overflow horizontally", async ({ page }) => {
    for (const path of ["/", "/calculator/mortgage", "/calculator/debt-payoff"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
