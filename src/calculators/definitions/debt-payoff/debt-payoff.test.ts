import { describe, expect, it } from "vitest";
import { loanPayment, monthsToPayoff } from "@/lib/finance";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { simulateDebtPayoff } from "./logic";

describe("simulateDebtPayoff", () => {
  it("matches the closed-form payoff for a single debt", () => {
    const payment = loanPayment(10_000, 18, 36);
    const r = simulateDebtPayoff({ debts: [{ label: "A", balance: 10_000, aprPercent: 18, minPayment: payment }], extraMonthly: 0, strategy: "avalanche" });
    expect(r.months).toBe(36);
    expect(r.totalInterest).toBeCloseTo(payment * 36 - 10_000, 4);
    expect(r.totalPaid).toBeCloseTo(payment * 36, 4);
  });

  it("agrees with NPER when the payment does not divide evenly", () => {
    const r = simulateDebtPayoff({ debts: [{ label: "A", balance: 5_000, aprPercent: 20, minPayment: 150 }], extraMonthly: 0, strategy: "avalanche" });
    expect(r.months).toBe(Math.ceil(monthsToPayoff(5_000, 20, 150)));
  });

  const debts = [
    { label: "Card", balance: 6_000, aprPercent: 22.9, minPayment: 180 },
    { label: "Car", balance: 12_000, aprPercent: 7.5, minPayment: 350 },
    { label: "Student", balance: 18_000, aprPercent: 5.5, minPayment: 200 },
  ];

  it("avalanche never costs more interest than snowball", () => {
    const avalanche = simulateDebtPayoff({ debts, extraMonthly: 200, strategy: "avalanche" });
    const snowball = simulateDebtPayoff({ debts, extraMonthly: 200, strategy: "snowball" });
    expect(avalanche.totalInterest).toBeLessThanOrEqual(snowball.totalInterest + 1e-6);
    expect(avalanche.paidOff && snowball.paidOff).toBe(true);
  });

  it("conserves money: total paid = balances + interest", () => {
    const r = simulateDebtPayoff({ debts, extraMonthly: 200, strategy: "snowball" });
    expect(r.totalPaid).toBeCloseTo(36_000 + r.totalInterest, 4);
  });

  it("pays the priority debt off first", () => {
    const avalanche = simulateDebtPayoff({ debts, extraMonthly: 200, strategy: "avalanche" });
    expect(avalanche.payoffMonth[0]).toBeLessThan(avalanche.payoffMonth[1]!);
  });

  it("extra payments and rollover beat minimums only", () => {
    const plan = simulateDebtPayoff({ debts, extraMonthly: 200, strategy: "avalanche" });
    const minimums = simulateDebtPayoff({ debts, extraMonthly: 0, strategy: "avalanche", rollover: false });
    expect(plan.months).toBeLessThan(minimums.months);
    expect(plan.totalInterest).toBeLessThan(minimums.totalInterest);
  });

  it("detects debts that never pay off", () => {
    const r = simulateDebtPayoff({ debts: [{ label: "A", balance: 10_000, aprPercent: 30, minPayment: 200 }], extraMonthly: 0, strategy: "avalanche" });
    expect(r.paidOff).toBe(false);
    expect(r.months).toBe(Infinity);
  });
});

describe("debt payoff definition", () => {
  it("computes defaults", () => {
    const v = validateValues(definition, getDefaultValues(definition));
    expect(v.ok).toBe(true);
    const result = definition.compute(v.values as never);
    expect(result.primary.format).toBe("months");
    expect(result.sections?.[0]?.items).toHaveLength(3);
  });

  it("requires a minimum payment for each debt with a balance", () => {
    const v = validateValues(definition, { ...getDefaultValues(definition), b4: 1000, r4: 10, p4: 0 });
    expect(v.errors.p4).toBeDefined();
  });

  it("requires at least one debt", () => {
    const v = validateValues(definition, { ...getDefaultValues(definition), b1: 0, b2: 0, b3: 0 });
    expect(v.errors.b1).toBeDefined();
  });
});
