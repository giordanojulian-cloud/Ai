import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { calculateCompoundInterest } from "./logic";

const base = { principal: 10_000, monthlyContribution: 0, ratePercent: 5, frequency: "monthly" as const, years: 10, timing: "end" as const };

describe("calculateCompoundInterest", () => {
  it("matches A = P(1 + r/n)^(nt) for every frequency", () => {
    expect(calculateCompoundInterest({ ...base, frequency: "annually" }).balance).toBeCloseTo(16_288.95, 2);
    expect(calculateCompoundInterest({ ...base, frequency: "quarterly" }).balance).toBeCloseTo(10_000 * 1.0125 ** 40, 6);
    expect(calculateCompoundInterest(base).balance).toBeCloseTo(16_470.09, 2);
    expect(calculateCompoundInterest({ ...base, frequency: "daily" }).balance).toBeCloseTo(10_000 * (1 + 0.05 / 365) ** 3650, 6);
    expect(calculateCompoundInterest({ ...base, frequency: "continuously" }).balance).toBeCloseTo(10_000 * Math.exp(0.5), 6);
  });

  it("matches the documented example with monthly contributions", () => {
    const r = calculateCompoundInterest({ ...base, monthlyContribution: 100 });
    expect(r.balance).toBeCloseTo(31_998.32, 1);
    expect(r.totalContributions).toBe(12_000);
    expect(r.totalGrowth).toBeCloseTo(r.balance - 22_000, 6);
  });

  it("start-of-month contributions earn one extra month of interest", () => {
    const end = calculateCompoundInterest({ ...base, principal: 0, monthlyContribution: 100 });
    const start = calculateCompoundInterest({ ...base, principal: 0, monthlyContribution: 100, timing: "start" });
    expect(start.balance).toBeCloseTo(end.balance * (1 + 0.05 / 12), 6);
  });

  it("handles a zero rate", () => {
    const r = calculateCompoundInterest({ ...base, ratePercent: 0, monthlyContribution: 50 });
    expect(r.balance).toBe(16_000);
    expect(r.totalGrowth).toBe(0);
  });

  it("reports the effective annual rate", () => {
    expect(calculateCompoundInterest(base).effectiveAnnualRatePercent).toBeCloseTo(5.1162, 3);
  });

  it("produces one row per year", () => {
    expect(calculateCompoundInterest(base).years).toHaveLength(10);
  });
});

describe("compound interest definition", () => {
  it("validates and computes defaults", () => {
    const v = validateValues(definition, getDefaultValues(definition));
    expect(v.ok).toBe(true);
    expect(definition.compute(v.values as never).primary.value).toBeGreaterThan(10_000);
  });

  it("rejects fractional years and negative deposits", () => {
    const defaults = getDefaultValues(definition);
    expect(validateValues(definition, { ...defaults, years: 2.5 }).errors.years).toBeDefined();
    expect(validateValues(definition, { ...defaults, principal: -1 }).errors.principal).toBeDefined();
  });
});
