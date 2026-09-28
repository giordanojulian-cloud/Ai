import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { calculateClosingCosts } from "./logic";

describe("closing costs", () => {
  it("matches the documented example using the defaults", () => {
    const v = validateValues(definition, getDefaultValues(definition));
    expect(v.ok).toBe(true);
    const result = definition.compute(v.values as never);
    expect(result.primary.value).toBeCloseTo(12_054.79, 2);
    expect(result.secondary[0]?.value).toBeCloseTo(92_054.79, 2);
  });

  it("bases fees on the right amounts", () => {
    const r = calculateClosingCosts({
      price: 500_000, downPayment: 100_000, ratePercent: 7.3, originationPercent: 1, discountPoints: 1, appraisal: 0, creditReport: 0,
      otherLenderFees: 0, titleInsurancePercent: 1, settlementFee: 0, recordingFees: 0, transferTaxPercent: 1, inspection: 0,
      prepaidInterestDays: 10, insuranceAnnual: 0, insuranceMonthsPrepaid: 0, propertyTaxPercent: 0, taxEscrowMonths: 0, other: 0,
    });
    const lender = r.groups.find((g) => g.id === "lender")!;
    expect(lender.total).toBe(8_000); // 2% of the $400k loan
    expect(r.groups.find((g) => g.id === "title")!.total).toBe(10_000); // 2% of price
    expect(r.groups.find((g) => g.id === "prepaids")!.total).toBeCloseTo(400_000 * 0.073 / 365 * 10, 8);
  });
});
