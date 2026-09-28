import { expect, test, type Page } from "@playwright/test";

/** Wait until the calculator has hydrated so typed input is handled by React. */
async function openCalculator(page: Page, url: string) {
  await page.goto(url);
  await page.locator("[data-calculator][data-ready]").waitFor();
}

test.describe("calculator pages", () => {
  test("mortgage calculator renders a result and updates as inputs change", async ({ page }) => {
    await openCalculator(page, "/calculator/mortgage");
    await expect(page.getByRole("heading", { level: 1, name: "Mortgage Calculator" })).toBeVisible();
    const primary = page.getByTestId("primary-result");
    await expect(primary).toHaveText("$2,539.28");

    const price = page.getByLabel("Home price");
    await price.fill("500000");
    await expect(primary).not.toHaveText("$2,539.28");
    // Inputs are mirrored into a shareable URL.
    await expect(page).toHaveURL(/price=500000/);
  });

  test("shared links restore inputs", async ({ page }) => {
    await openCalculator(page, "/calculator/mortgage?price=500000&down=20&downUnit=percent&rate=6&term=30&tax=1.1&taxUnit=percent&ins=1800&hoa=0&pmi=0.5&extra=0");
    await expect(page.getByTestId("primary-result")).toHaveText("$3,006.54");
  });

  test("invalid input shows an accessible error and keeps the last result", async ({ page }) => {
    await openCalculator(page, "/calculator/mortgage");
    const rate = page.getByLabel("Interest rate");
    await rate.fill("45");
    await expect(rate).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText(/Enter a value between/)).toBeVisible();
    await expect(page.getByText("Fix the highlighted inputs to update your results.")).toBeVisible();
  });

  test("amortization schedule switches views", async ({ page }) => {
    await openCalculator(page, "/calculator/mortgage");
    await page.getByRole("tab", { name: "Monthly" }).click();
    await expect(page.getByRole("button", { name: /Show all 360 rows/ })).toBeVisible();
    await page.getByRole("tab", { name: "Full term" }).click();
    await expect(page.getByRole("cell", { name: "Total cost" })).toBeVisible();
  });

  test("every calculator page renders a finite primary result", async ({ page, request }) => {
    const index = (await (await request.get("/api/search-index")).json()) as { slug: string }[];
    expect(index.length).toBeGreaterThanOrEqual(20);
    for (const { slug } of index) {
      await page.goto(`/calculator/${slug}`);
      await expect(page.getByTestId("primary-result"), slug).not.toHaveText(/—|NaN|Infinity/);
    }
  });

  test("charts load when scrolled into view", async ({ page }) => {
    await openCalculator(page, "/calculator/compound-interest");
    const chart = page.getByRole("img", { name: /Balance over time/ });
    await chart.scrollIntoViewIfNeeded();
    await expect(chart.locator("svg.recharts-surface[role=application]")).toBeVisible();
  });

  test("feedback widget is present", async ({ page }) => {
    await page.goto("/calculator/roi");
    await expect(page.getByText("Was this calculator helpful?")).toBeVisible();
    await expect(page.getByText("Suggest a calculator")).toBeVisible();
  });
});
