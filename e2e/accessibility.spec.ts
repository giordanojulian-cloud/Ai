import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/calculators", "/category/real-estate", "/calculator/mortgage", "/calculator/debt-payoff", "/calculator/rental-property", "/pricing", "/signin"];

for (const path of PAGES) {
  test(`${path} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

test("dark mode has no contrast violations on a calculator", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/calculator/compound-interest");
  await page.waitForLoadState("networkidle");
  const results = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
