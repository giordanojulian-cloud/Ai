import { describe, expect, it } from "vitest";
import { payEquivalents } from "./logic";

const base = { mode: "salary-to-hourly" as const, amount: 65_000, hoursPerWeek: 40, daysPerWeek: 5, weeksPerYear: 52 };

describe("payEquivalents", () => {
  it("matches the documented example", () => {
    const p = payEquivalents(base);
    expect(p.hoursPerYear).toBe(2_080);
    expect(p.hourly).toBe(31.25);
    expect(p.biweekly).toBe(2_500);
    expect(p.monthly).toBeCloseTo(5_416.67, 2);
    expect(p.semimonthly).toBeCloseTo(2_708.33, 2);
    expect(p.daily).toBe(250);
  });

  it("converts hourly to salary", () => {
    const p = payEquivalents({ ...base, mode: "hourly-to-salary", amount: 25 });
    expect(p.annual).toBe(52_000);
  });

  it("round-trips", () => {
    const hourly = payEquivalents({ ...base, weeksPerYear: 48, hoursPerWeek: 37.5 }).hourly;
    expect(payEquivalents({ ...base, mode: "hourly-to-salary", amount: hourly, weeksPerYear: 48, hoursPerWeek: 37.5 }).annual).toBeCloseTo(65_000, 8);
  });

  it("matches the $50,000 FAQ answer", () => {
    expect(payEquivalents({ ...base, amount: 50_000 }).hourly).toBeCloseTo(24.04, 2);
  });
});
