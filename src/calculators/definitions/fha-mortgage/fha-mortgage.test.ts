import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { annualMipRate, mipDurationMonths } from "./fha-rules";
import { calculateFha } from "./logic";

const base = {
  price: 350_000,
  downPayment: 12_250,
  ratePercent: 6.25,
  termYears: 30,
  propertyTaxAnnual: 0,
  insuranceAnnual: 0,
  hoaMonthly: 0,
  upfrontMipPercent: 1.75,
  financeUpfrontMip: true,
};

describe("FHA MIP table", () => {
  it("returns long-term rates", () => {
    expect(annualMipRate(30, 337_750, 96.5)).toBe(0.55);
    expect(annualMipRate(30, 337_750, 95)).toBe(0.5);
    expect(annualMipRate(30, 800_000, 96.5)).toBe(0.75);
    expect(annualMipRate(30, 800_000, 90)).toBe(0.7);
  });

  it("returns 15-year rates", () => {
    expect(annualMipRate(15, 300_000, 90)).toBe(0.15);
    expect(annualMipRate(15, 300_000, 95)).toBe(0.4);
    expect(annualMipRate(15, 800_000, 75)).toBe(0.15);
    expect(annualMipRate(15, 800_000, 85)).toBe(0.4);
    expect(annualMipRate(15, 800_000, 95)).toBe(0.65);
  });

  it("uses 11-year duration only at 90% LTV or less", () => {
    expect(mipDurationMonths(360, 90)).toBe(132);
    expect(mipDurationMonths(360, 96.5)).toBe(360);
  });
});

describe("calculateFha", () => {
  it("matches the documented example", () => {
    const r = calculateFha(base);
    expect(r.baseLoan).toBe(337_750);
    expect(r.upfrontMip).toBeCloseTo(5_910.625, 6);
    expect(r.totalLoan).toBeCloseTo(343_660.625, 6);
    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(2_115.98, 2);
    expect(r.annualMipPercent).toBe(0.55);
    expect(r.monthlyMipFirstYear).toBeCloseTo(156.67, 2);
    expect(r.mipMonths).toBe(360);
  });

  it("stops MIP after 11 years with 10% down", () => {
    const r = calculateFha({ ...base, downPayment: 35_000 });
    expect(r.mipMonths).toBe(132);
    expect(r.schedule.rows[131]!.mortgageInsurance).toBeGreaterThan(0);
    expect(r.schedule.rows[132]!.mortgageInsurance).toBe(0);
  });

  it("does not finance the upfront MIP when disabled", () => {
    expect(calculateFha({ ...base, financeUpfrontMip: false }).totalLoan).toBe(337_750);
  });

  it("honors a custom MIP rate", () => {
    expect(calculateFha({ ...base, annualMipPercent: 0.85 }).annualMipPercent).toBe(0.85);
  });

  it("flags down payments below the FHA minimum", () => {
    expect(calculateFha({ ...base, downPayment: 5_000 }).meetsMinimumDown).toBe(false);
    expect(calculateFha(base).meetsMinimumDown).toBe(true);
  });
});

describe("FHA definition", () => {
  it("computes defaults", () => {
    const v = validateValues(definition, getDefaultValues(definition));
    expect(v.ok).toBe(true);
    expect(definition.compute(v.values as never).primary.value).toBeGreaterThan(2_115);
  });
});
