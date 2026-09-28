import { describe, expect, it } from "vitest";
import { calculateInvestmentGrowth, netOfFees } from "./logic";

const base = { initial: 10_000, monthlyContribution: 0, returnPercent: 7, years: 10, contributionIncreasePercent: 0, inflationPercent: 0, feePercent: 0 };

describe("calculateInvestmentGrowth", () => {
  it("compounds a lump sum at the effective annual rate", () => {
    expect(calculateInvestmentGrowth(base).balance).toBeCloseTo(10_000 * 1.07 ** 10, 6);
  });

  it("values monthly contributions with the equivalent monthly rate", () => {
    const r = calculateInvestmentGrowth({ ...base, initial: 0, monthlyContribution: 100 });
    const i = 1.07 ** (1 / 12) - 1;
    expect(r.balance).toBeCloseTo((100 * ((1 + i) ** 120 - 1)) / i, 6);
  });

  it("deflates by cumulative inflation", () => {
    const r = calculateInvestmentGrowth({ ...base, inflationPercent: 3 });
    expect(r.realBalance).toBeCloseTo(r.balance / 1.03 ** 10, 6);
  });

  it("applies fees and reports their cost", () => {
    const r = calculateInvestmentGrowth({ ...base, feePercent: 1 });
    expect(r.netReturnPercent).toBeCloseTo(5.93, 10);
    expect(r.balance).toBeCloseTo(10_000 * 1.0593 ** 10, 6);
    expect(r.feeDrag).toBeCloseTo(10_000 * 1.07 ** 10 - r.balance, 6);
  });

  it("steps contributions up once a year", () => {
    const r = calculateInvestmentGrowth({ ...base, initial: 0, monthlyContribution: 100, returnPercent: 0, years: 2, contributionIncreasePercent: 10 });
    expect(r.totalContributions).toBeCloseTo(1200 + 1320, 8);
  });

  it("handles negative returns", () => {
    expect(calculateInvestmentGrowth({ ...base, returnPercent: -5 }).totalGrowth).toBeLessThan(0);
  });

  it("netOfFees is identity with no fee", () => {
    expect(netOfFees(7, 0)).toBeCloseTo(7, 12);
  });
});
