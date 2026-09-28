import { expect, test, type Page } from "@playwright/test";

/**
 * Database-backed flows. Opt-in because they need Postgres and the dev login:
 *   AUTH_DEV_LOGIN=true ADMIN_EMAILS=admin@example.com npm run dev -- --port 3100
 *   E2E_FULL_STACK=1 npx playwright test e2e/full-stack.spec.ts
 */
test.skip(!process.env.E2E_FULL_STACK, "Set E2E_FULL_STACK=1 with a database-backed dev server.");
test.describe.configure({ mode: "serial" });

async function signIn(page: Page, email: string, callbackUrl = "/dashboard") {
  await page.goto(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  await page.getByLabel("Development login").fill(email);
  await page.getByRole("button", { name: "Sign in (dev)" }).click();
  await page.waitForURL(`**${callbackUrl}`);
}

test("save, rename, duplicate and delete a calculation", async ({ page }) => {
  const email = `user-${Date.now()}@example.com`;
  await signIn(page, email);
  await expect(page.getByText("No saved calculations yet")).toBeVisible();

  await page.goto("/calculator/tip");
  await page.locator("[data-calculator][data-ready]").waitFor();
  await page.getByRole("button", { name: /^Save/ }).click();
  await page.getByLabel("Name this calculation").fill("Friday dinner");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("button", { name: /Saved to dashboard/ })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByRole("link", { name: "Friday dinner" })).toBeVisible();

  await page.getByRole("button", { name: "Rename" }).click();
  await page.getByLabel("Calculation name").fill("Team dinner");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("link", { name: "Team dinner", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Duplicate" }).click();
  await expect(page.getByRole("link", { name: "Team dinner (copy)" })).toBeVisible();

  page.on("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "Delete" }).first().click();
  await expect(page.getByRole("link", { name: /Team dinner/ })).toHaveCount(1);

  // Opening a saved calculation restores its inputs.
  await page.getByRole("link", { name: /Team dinner/ }).click();
  await expect(page).toHaveURL(/\/calculator\/tip\?/);
});

test("non-admins cannot reach the admin area", async ({ page }) => {
  await signIn(page, `visitor-${Date.now()}@example.com`);
  const response = await page.goto("/admin");
  expect(response?.status()).toBe(404);
});

test("admins can override calculator metadata", async ({ page }) => {
  await signIn(page, "admin@example.com", "/admin/calculators/tip");
  await page.getByLabel("Short description").fill("Split any bill and tip fairly — updated from the admin.");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/Saved\./)).toBeVisible();

  await page.goto("/category/everyday");
  await expect(page.getByText("Split any bill and tip fairly — updated from the admin.")).toBeVisible();

  await page.goto("/admin/calculators/tip");
  await Promise.all([
    page.waitForResponse((r) => r.request().method() === "POST" && r.url().includes("/admin/calculators/tip")),
    page.getByRole("button", { name: "Reset to code defaults" }).click(),
  ]);
  await page.goto("/category/everyday");
  await expect(page.getByText("Split any bill and tip fairly — updated from the admin.")).toHaveCount(0);
});

test("feedback and newsletter submissions are stored", async ({ page }) => {
  await page.goto("/calculator/roi");
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(page.getByText(/Thanks — your feedback/)).toBeVisible();
  await page.getByLabel("Email address").first().fill(`news-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Subscribe" }).first().click();
  await expect(page.getByText("You’re on the list.", { exact: false }).first()).toBeVisible();
});
