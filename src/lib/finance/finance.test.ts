import { describe, expect, it } from "vitest";
import {
  amortizationSchedule,
  effectiveAnnualRate,
  equivalentMonthlyRate,
  loanPayment,
  monthsToPayoff,
  remainingBalance,
  summarizeByYear,
} from "./index";

describe("loanPayment", () => {
  // Reference values cross-checked against the standard annuity formula
  // (and spreadsheet PMT()).
  it("matches known mortgage payments", () => {
    expect(loanPayment(400_000, 6.5, 360)).toBeCloseTo(2528.27, 2);
    expect(loanPayment(200_000, 5, 360)).toBeCloseTo(1073.64, 2);
    expect(loanPayment(100_000, 4, 180)).toBeCloseTo(739.69, 2);
  });

  it("handles zero interest", () => {
    expect(loanPayment(12_000, 0, 12)).toBe(1000);
  });

  it("returns zero for empty loans", () => {
    expect(loanPayment(0, 5, 360)).toBe(0);
    expect(loanPayment(1000, 5, 0)).toBe(0);
  });
});

describe("amortizationSchedule", () => {
  const rows = amortizationSchedule(400_000, 6.5, 360);

  it("pays the loan to exactly zero over the term", () => {
    expect(rows).toHaveLength(360);
    expect(rows.at(-1)?.balance).toBe(0);
    const principal = rows.reduce((s, r) => s + r.principal, 0);
    expect(principal).toBeCloseTo(400_000, 6);
  });

  it("computes first-month interest on the opening balance", () => {
    expect(rows[0]?.interest).toBeCloseTo(400_000 * (0.065 / 12), 8);
  });

  it("totals interest correctly", () => {
    const interest = rows.reduce((s, r) => s + r.interest, 0);
    expect(interest).toBeCloseTo(2528.2714 * 360 - 400_000, 0);
  });

  it("agrees with the closed-form remaining balance", () => {
    expect(rows[59]?.balance).toBeCloseTo(remainingBalance(400_000, 6.5, 360, 60), 6);
  });

  it("shortens the loan with extra payments", () => {
    const extra = amortizationSchedule(400_000, 6.5, 360, { extraMonthly: 500 });
    expect(extra.length).toBeLessThan(360);
    expect(extra.at(-1)?.balance).toBe(0);
    const paid = extra.reduce((s, r) => s + r.principal + r.extraPrincipal, 0);
    expect(paid).toBeCloseTo(400_000, 6);
  });

  it("summarizes by year", () => {
    const years = summarizeByYear(rows);
    expect(years).toHaveLength(30);
    expect(years[0]?.payment).toBeCloseTo(2528.2714 * 12, 1);
    expect(years.at(-1)?.endingBalance).toBe(0);
  });
});

describe("monthsToPayoff", () => {
  it("inverts the payment formula", () => {
    const payment = loanPayment(10_000, 18, 36);
    expect(monthsToPayoff(10_000, 18, payment)).toBeCloseTo(36, 6);
  });

  it("returns Infinity when the payment does not cover interest", () => {
    expect(monthsToPayoff(10_000, 24, 200)).toBe(Infinity);
  });

  it("handles zero interest", () => {
    expect(monthsToPayoff(1000, 0, 100)).toBe(10);
  });
});

describe("rates", () => {
  it("converts nominal to effective annual rates", () => {
    expect(effectiveAnnualRate(5, "monthly")).toBeCloseTo(0.0511619, 6);
    expect(effectiveAnnualRate(5, "daily")).toBeCloseTo(0.0512675, 6);
    expect(effectiveAnnualRate(5, "continuously")).toBeCloseTo(0.0512711, 6);
    expect(effectiveAnnualRate(5, "annually")).toBeCloseTo(0.05, 10);
  });

  it("produces an equivalent monthly rate", () => {
    expect(equivalentMonthlyRate(6, "monthly")).toBeCloseTo(0.005, 10);
    expect((1 + equivalentMonthlyRate(6, "quarterly")) ** 12).toBeCloseTo(1.015 ** 4, 10);
  });
});
