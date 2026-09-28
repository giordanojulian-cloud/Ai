import { describe, expect, it } from "vitest";
import { valueSaas } from "./logic";

const base = { mrr: 50_000, growthPercent: 40, grossMarginPercent: 80, netMarginPercent: 15, monthlyChurnPercent: 2, revenueMultiple: 5, profitMultiple: 15, scenarioSpreadPercent: 25 };

describe("valueSaas", () => {
  it("matches the documented example", () => {
    const r = valueSaas(base);
    expect(r.arr).toBe(600_000);
    expect(r.annualProfit).toBe(90_000);
    expect(r.revenueValuation).toBe(3_000_000);
    expect(r.profitValuation).toBe(1_350_000);
    expect(r.scenarios[0]!.revenueValuation).toBe(2_250_000);
    expect(r.scenarios[2]!.revenueValuation).toBe(3_750_000);
    expect(r.annualChurnPercent).toBeCloseTo(21.53, 2);
    expect(r.ruleOf40).toBe(55);
    expect(r.customerLifetimeMonths).toBe(50);
  });

  it("floors profit-based valuation at zero for loss-making companies", () => {
    expect(valueSaas({ ...base, netMarginPercent: -20 }).profitValuation).toBe(0);
  });
});
