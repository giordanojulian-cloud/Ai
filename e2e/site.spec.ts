import { expect, test } from "@playwright/test";

test.describe("site", () => {
  test("homepage search finds calculators despite typos", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Calculate Anything");
    const search = page.getByRole("combobox", { name: "Search calculators" });
    await search.fill("morgage");
    await expect(page.getByRole("option").first()).toContainText("Mortgage Calculator");
    await search.press("Enter");
    await expect(page).toHaveURL(/\/calculator\/mortgage$/);
  });

  test("natural-language search results page", async ({ page }) => {
    await page.goto("/search?q=how%20much%20house%20can%20I%20afford");
    await expect(page.getByRole("link", { name: /Mortgage Affordability Calculator/ }).first()).toBeVisible();
  });

  test("category pages link to calculators", async ({ page }) => {
    await page.goto("/category/business");
    await expect(page.getByRole("heading", { level: 1, name: "Business Calculators" })).toBeVisible();
    await page.getByRole("link", { name: /Break-Even Calculator/ }).click();
    await expect(page).toHaveURL(/\/calculator\/break-even$/);
  });

  test("SEO endpoints and metadata", async ({ page, request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/calculator/mortgage");
    expect(sitemap).toContain("/category/real-estate");
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");

    await page.goto("/calculator/mortgage?price=1");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/calculator\/mortgage$/);
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = jsonLd.join(" ");
    expect(types).toContain('"FAQPage"');
    expect(types).toContain('"BreadcrumbList"');
    expect(types).toContain('"WebApplication"');
  });

  test("unknown pages return 404", async ({ page }) => {
    const response = await page.goto("/calculator/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "We couldn’t find that page" })).toBeVisible();
  });

  test("private areas redirect to sign-in", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Fdashboard/);
  });

  test("APIs reject cross-origin and malformed requests", async ({ request }) => {
    const crossOrigin = await request.post("/api/feedback", { data: { calculatorSlug: "roi", helpful: true }, headers: { origin: "https://evil.example" } });
    expect(crossOrigin.status()).toBe(403);
    const invalid = await request.post("/api/newsletter", { data: { email: "not-an-email" } });
    expect(invalid.status()).toBe(400);
  });
});
