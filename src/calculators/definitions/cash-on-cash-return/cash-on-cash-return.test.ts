import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { cashOnCash } from "./logic";

describe("cash-on-cash return", () => {
  it("matches the documented example", () => {
    const v = validateValues(definition, getDefaultValues(definition));
    const result = definition.compute(v.values as never);
    expect(result.primary.value).toBeCloseTo((3_900 / 70_000) * 100, 10);
    expect(result.secondary[0]?.value).toBeCloseTo(3_900, 8);
  });

  it("handles zero cash invested", () => {
    expect(cashOnCash(1_000, 0)).toBe(0);
  });

  it("requires cash invested", () => {
    expect(validateValues(definition, { ...getDefaultValues(definition), down: 0, closing: 0, rehab: 0 }).ok).toBe(false);
  });
});
