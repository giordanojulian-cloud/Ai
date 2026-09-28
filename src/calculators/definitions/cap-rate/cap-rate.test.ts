import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { capRate, valueFromCapRate } from "./logic";

describe("cap rate", () => {
  it("matches the documented example", () => {
    const v = validateValues(definition, getDefaultValues(definition));
    expect(definition.compute(v.values as never).primary.value).toBeCloseTo(7.4, 10);
    const value = validateValues(definition, { ...getDefaultValues(definition), mode: "value" });
    expect(definition.compute(value.values as never).primary.value).toBeCloseTo(1_138_461.54, 1);
  });

  it("inverts", () => {
    expect(capRate(50_000, valueFromCapRate(50_000, 5.5))).toBeCloseTo(5.5, 10);
  });

  it("guards against zero values", () => {
    expect(capRate(10_000, 0)).toBe(0);
    expect(valueFromCapRate(10_000, 0)).toBe(0);
  });
});
