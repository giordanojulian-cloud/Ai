import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { calculateBreakEven } from "./logic";

describe("calculateBreakEven", () => {
  it("matches the documented example", () => {
    const r = calculateBreakEven({ fixedCosts: 50_000, pricePerUnit: 80, variableCostPerUnit: 30, targetProfit: 20_000 });
    expect(r.contributionMargin).toBe(50);
    expect(r.contributionMarginRatio).toBe(62.5);
    expect(r.breakEvenUnits).toBe(1_000);
    expect(r.breakEvenRevenue).toBe(80_000);
    expect(r.unitsForTarget).toBe(1_400);
    expect(r.revenueForTarget).toBe(112_000);
  });

  it("returns Infinity when every sale loses money", () => {
    expect(calculateBreakEven({ fixedCosts: 1_000, pricePerUnit: 10, variableCostPerUnit: 12, targetProfit: 0 }).viable).toBe(false);
  });

  it("rounds the headline up to whole units", () => {
    const v = validateValues(definition, { ...getDefaultValues(definition), fixed: 50_010 });
    expect(definition.compute(v.values as never).primary.value).toBe(1_001);
  });

  it("does not round up exact results", () => {
    const v = validateValues(definition, getDefaultValues(definition));
    expect(definition.compute(v.values as never).primary.value).toBe(1_000);
  });
});
