import { describe, expect, it } from "vitest";
import { calculateAffordability, housingPayment, type AffordabilityInput } from "./logic";

const base: AffordabilityInput = {
  annualIncome: 100_000,
  monthlyDebts: 500,
  downPayment: 40_000,
  ratePercent: 6.5,
  termYears: 30,
  propertyTaxPercent: 1.1,
  insuranceAnnual: 1_800,
  hoaMonthly: 0,
  pmiRatePercent: 0.5,
  frontEndRatio: 28,
  backEndRatio: 36,
};

describe("calculateAffordability", () => {
  it("matches the documented example", () => {
    const r = calculateAffordability(base);
    expect(r.limitingRatio).toBe("front-end");
    expect(r.maxHousingPayment).toBeCloseTo(2_333.33, 2);
    expect(r.maxPrice).toBe(320_462);
    expect(r.payment.total).toBeLessThanOrEqual(r.maxHousingPayment);
    expect(housingPayment(r.maxPrice + 1, base).total).toBeGreaterThan(r.maxHousingPayment);
  });

  it("uses the back-end limit when debts are high", () => {
    const r = calculateAffordability({ ...base, monthlyDebts: 1_500 });
    expect(r.limitingRatio).toBe("back-end");
    expect(r.maxHousingPayment).toBeCloseTo(1_500, 6);
  });

  it("handles the PMI step at 80% LTV", () => {
    const r = calculateAffordability({ ...base, downPayment: 100_000 });
    // Just above 80% LTV the payment jumps; the solver must land on a price that fits.
    expect(r.payment.total).toBeLessThanOrEqual(r.maxHousingPayment + 1e-9);
  });

  it("reports unaffordable when debts consume the budget", () => {
    expect(calculateAffordability({ ...base, monthlyDebts: 5_000 }).affordable).toBe(false);
  });

  it("more income means a higher price", () => {
    expect(calculateAffordability({ ...base, annualIncome: 150_000 }).maxPrice).toBeGreaterThan(calculateAffordability(base).maxPrice);
  });
});
