import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { analyzeRental } from "./logic";

const base = {
  price: 300_000, downPayment: 75_000, ratePercent: 7, termYears: 30, closingCosts: 9_000, rehabCosts: 10_000,
  monthlyRent: 2_800, vacancyPercent: 5, propertyTaxAnnual: 3_600, insuranceAnnual: 1_500, hoaMonthly: 0,
  maintenancePercent: 5, managementPercent: 8, utilitiesMonthly: 0, otherMonthly: 100,
};

describe("analyzeRental", () => {
  it("matches the documented example", () => {
    const r = analyzeRental(base);
    expect(r.effectiveIncome).toBe(31_920);
    expect(r.operatingExpenses).toBeCloseTo(10_533.6, 6);
    expect(r.noi).toBeCloseTo(21_386.4, 6);
    expect(r.capRatePercent).toBeCloseTo(7.1288, 3);
    expect(r.monthlyDebtService).toBeCloseTo(1_496.93, 2);
    expect(r.annualCashFlow).toBeCloseTo(3_423.23, 1);
    expect(r.cashInvested).toBe(94_000);
    expect(r.cashOnCashPercent).toBeCloseTo(3.642, 2);
    expect(r.dscr).toBeCloseTo(1.19, 2);
  });

  it("treats an all-cash purchase as having no debt service", () => {
    const r = analyzeRental({ ...base, downPayment: 300_000 });
    expect(r.annualDebtService).toBe(0);
    expect(r.annualCashFlow).toBeCloseTo(r.noi, 8);
    expect(r.dscr).toBe(Infinity);
  });

  it("goes negative when rent can't cover costs", () => {
    expect(analyzeRental({ ...base, monthlyRent: 1_500 }).annualCashFlow).toBeLessThan(0);
  });

  it("computes rule-of-thumb metrics", () => {
    const r = analyzeRental(base);
    expect(r.onePercentRule).toBeCloseTo(0.9333, 3);
    expect(r.grossRentMultiplier).toBeCloseTo(300_000 / 33_600, 8);
  });
});

describe("rental definition", () => {
  it("computes defaults and totals the pro forma", () => {
    const v = validateValues(definition, getDefaultValues(definition));
    const result = definition.compute(v.values as never);
    expect(result.primary.value).toBeCloseTo(285.27, 2);
    const view = result.tables?.[0]?.views[0];
    expect(view?.footer?.annual).toBeCloseTo(3_423.23, 1);
  });
});
