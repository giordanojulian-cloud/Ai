import { describe, expect, it } from "vitest";
import { validateValues, getDefaultValues } from "../../engine/values";
import definition from "./definition";
import { calculateMortgage } from "./logic";

const base = {
  homePrice: 400_000,
  downPayment: 80_000,
  ratePercent: 6.5,
  termYears: 30,
  propertyTaxAnnual: 4_400,
  insuranceAnnual: 1_800,
  hoaMonthly: 0,
  pmiRatePercent: 0.5,
  extraMonthly: 0,
};

describe("calculateMortgage", () => {
  it("computes the documented example", () => {
    const r = calculateMortgage(base);
    expect(r.loanAmount).toBe(320_000);
    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(2022.62, 2);
    expect(r.monthlyTax).toBeCloseTo(366.67, 2);
    expect(r.monthlyInsurance).toBe(150);
    expect(r.monthlyPmi).toBe(0);
    expect(r.totalMonthlyPayment).toBeCloseTo(2539.28, 2);
    expect(r.totalInterest).toBeCloseTo(2022.6171 * 360 - 320_000, 0);
    expect(r.payoffMonths).toBe(360);
  });

  it("applies PMI under 20% down and cancels it at 78% LTV", () => {
    const r = calculateMortgage({ ...base, downPayment: 40_000 });
    expect(r.pmiApplies).toBe(true);
    expect(r.monthlyPmi).toBeCloseTo((360_000 * 0.005) / 12, 8);
    // PMI stops once the opening balance is at or below 78% of $400k = $312,000.
    const lastPmiRow = r.schedule.rows[r.pmiLastMonth - 1]!;
    const firstFreeRow = r.schedule.rows[r.pmiLastMonth]!;
    expect(lastPmiRow.mortgageInsurance).toBeGreaterThan(0);
    expect(firstFreeRow.mortgageInsurance).toBe(0);
    const openingOfFree = lastPmiRow.balance;
    expect(openingOfFree).toBeLessThanOrEqual(312_000);
    expect(r.totalPmi).toBeCloseTo(r.monthlyPmi * r.pmiLastMonth, 6);
  });

  it("does not charge PMI at exactly 20% down", () => {
    expect(calculateMortgage(base).pmiApplies).toBe(false);
  });

  it("totals every dollar paid in total cost", () => {
    const r = calculateMortgage({ ...base, hoaMonthly: 100 });
    const expected = 80_000 + 320_000 + r.totalInterest + (4_400 / 12 + 150 + 100) * 360;
    expect(r.totalCost).toBeCloseTo(expected, 4);
  });

  it("extra payments shorten the loan and reduce interest", () => {
    const withExtra = calculateMortgage({ ...base, extraMonthly: 300 });
    const without = calculateMortgage(base);
    expect(withExtra.payoffMonths).toBeLessThan(360);
    expect(withExtra.totalInterest).toBeLessThan(without.totalInterest);
  });

  it("handles a 0% rate", () => {
    const r = calculateMortgage({ ...base, ratePercent: 0 });
    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(320_000 / 360, 8);
    expect(r.totalInterest).toBe(0);
  });
});

describe("mortgage definition", () => {
  it("computes with default values", () => {
    const values = getDefaultValues(definition);
    const validation = validateValues(definition, values);
    expect(validation.ok).toBe(true);
    const result = definition.compute(validation.values as never);
    expect(result.primary.value).toBeCloseTo(2539.28, 2);
    expect(result.tables?.[0]?.views.map((v) => v.id)).toEqual(["annual", "monthly", "term"]);
  });

  it("converts dollar down payments", () => {
    const values = { ...getDefaultValues(definition), downPayment: 40_000, downPaymentUnit: "amount" };
    const validation = validateValues(definition, values);
    expect(validation.ok).toBe(true);
    const result = definition.compute(validation.values as never);
    expect(result.secondary.find((s) => s.label === "Loan amount")?.value).toBe(360_000);
  });

  it("rejects a down payment larger than the price", () => {
    const values = { ...getDefaultValues(definition), downPayment: 500_000, downPaymentUnit: "amount" };
    const validation = validateValues(definition, values);
    expect(validation.ok).toBe(false);
    expect(validation.errors.downPayment).toMatch(/less than the home price/);
  });

  it("rejects out-of-range rates and wrong types", () => {
    expect(validateValues(definition, { ...getDefaultValues(definition), interestRate: 40 }).errors.interestRate).toBeDefined();
    expect(validateValues(definition, { ...getDefaultValues(definition), interestRate: "6" }).ok).toBe(false);
    expect(validateValues(definition, { ...getDefaultValues(definition), loanTerm: "7" }).ok).toBe(false);
  });
});
