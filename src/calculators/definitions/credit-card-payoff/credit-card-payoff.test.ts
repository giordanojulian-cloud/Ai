import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { payoffWithFixedPayment, payoffWithMinimums, paymentForMonths } from "./logic";

describe("credit card payoff", () => {
  it("matches the documented $8,000 at 24% example", () => {
    const plan = payoffWithFixedPayment(8_000, 24, 300);
    expect(plan.rows[0]?.interest).toBeCloseTo(160, 8);
    expect(plan.months).toBe(39);
    expect(plan.totalInterest).toBeCloseTo(3_546.79, 1);
  });

  it("finds the payment for a target date", () => {
    const payment = paymentForMonths(8_000, 24, 24);
    expect(payment).toBeCloseTo(422.97, 2);
    const plan = payoffWithFixedPayment(8_000, 24, payment);
    expect(plan.months).toBe(24);
    expect(plan.totalInterest).toBeCloseTo(payment * 24 - 8_000, 4);
  });

  it("conserves money", () => {
    const plan = payoffWithFixedPayment(5_000, 19.9, 250);
    expect(plan.totalPaid).toBeCloseTo(5_000 + plan.totalInterest, 6);
  });

  it("detects payments that don't cover interest", () => {
    expect(payoffWithFixedPayment(10_000, 24, 200).paidOff).toBe(false);
  });

  it("minimum payments take far longer", () => {
    expect(payoffWithMinimums(8_000, 24).months).toBeGreaterThan(payoffWithFixedPayment(8_000, 24, 300).months * 3);
  });

  it("handles 0% APR", () => {
    const plan = payoffWithFixedPayment(1_000, 0, 100);
    expect(plan.months).toBe(10);
    expect(plan.totalInterest).toBe(0);
  });

  it("validates payments below interest", () => {
    const v = validateValues(definition, { ...getDefaultValues(definition), payment: 100 });
    expect(v.errors.payment).toMatch(/doesn't cover/);
  });

  it("ignores the hidden payment field in target-date mode", () => {
    const v = validateValues(definition, { ...getDefaultValues(definition), mode: "months", payment: 0 });
    expect(v.ok).toBe(true);
    expect(definition.compute(v.values as never).primary.label).toBe("Required monthly payment");
  });
});
