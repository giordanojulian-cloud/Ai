import { describe, expect, it } from "vitest";
import { entitlementsFor, hasFeature } from "./entitlements";

describe("entitlementsFor", () => {
  const sub = { tier: "PRO", status: "ACTIVE", currentPeriodEnd: null, cancelAtPeriodEnd: false };

  it("grants Pro features to active subscriptions", () => {
    const e = entitlementsFor(sub);
    expect(e.tier).toBe("PRO");
    expect(hasFeature(e, "unlimited_saves")).toBe(true);
  });

  it("treats trials as active", () => {
    expect(entitlementsFor({ ...sub, status: "TRIALING" }).tier).toBe("PRO");
  });

  it("falls back to free for lapsed subscriptions", () => {
    const e = entitlementsFor({ ...sub, status: "PAST_DUE" });
    expect(e.tier).toBe("FREE");
    expect(hasFeature(e, "no_ads")).toBe(false);
    expect(hasFeature(e, "csv_export")).toBe(true);
  });

  it("handles no subscription", () => {
    expect(entitlementsFor(null).tier).toBe("FREE");
  });
});
