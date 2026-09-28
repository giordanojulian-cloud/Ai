import { describe, expect, it } from "vitest";
import { calculateEmployeeCost } from "./logic";
import { PAYROLL_RULES } from "./payroll-rules";

const base = {
  salary: 75_000, healthInsuranceAnnual: 7_500, retirementMatchPercent: 4, otherBenefitsAnnual: 1_000, workersCompPercent: 0.5,
  sutaRatePercent: 2.7, sutaWageBase: 7_000, overheadAnnual: 3_000, paidHoursPerYear: 2_080, paidDaysOff: 20,
};

describe("calculateEmployeeCost", () => {
  it("matches the documented example", () => {
    const r = calculateEmployeeCost(base);
    expect(r.totalCost).toBeCloseTo(95_843.5, 6);
    expect(r.productiveHours).toBe(1_920);
    expect(r.costPerProductiveHour).toBeCloseTo(49.92, 2);
    expect(r.multiplier).toBeCloseTo(1.278, 3);
  });

  it("caps Social Security at the wage base", () => {
    const r = calculateEmployeeCost({ ...base, salary: 300_000 });
    const ss = r.lines.find((l) => l.label.startsWith("Social Security"))!;
    expect(ss.amount).toBeCloseTo(PAYROLL_RULES.socialSecurityWageBase * 0.062, 6);
    const medicare = r.lines.find((l) => l.label.startsWith("Medicare"))!;
    expect(medicare.amount).toBeCloseTo(300_000 * 0.0145, 6);
  });

  it("caps FUTA at $7,000 of wages", () => {
    const r = calculateEmployeeCost({ ...base, salary: 5_000 });
    expect(r.lines.find((l) => l.label.includes("FUTA"))!.amount).toBeCloseTo(30, 8);
  });
});
