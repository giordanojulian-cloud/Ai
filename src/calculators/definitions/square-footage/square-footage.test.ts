import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";
import { SQ_FT_TO_SQ_M, totalArea } from "./logic";

describe("square footage", () => {
  it("matches the documented example", () => {
    expect(totalArea([[12, 14], [10, 12]])).toBe(288);
    expect(288 * SQ_FT_TO_SQ_M).toBeCloseTo(26.756, 3);
    const v = validateValues(definition, { ...getDefaultValues(definition), price: 4.5 });
    const r = definition.compute(v.values as never);
    expect(r.primary.value).toBe(288);
    expect(r.secondary[0]?.value).toBeCloseTo(316.8, 8);
    expect(r.secondary.at(-1)?.value).toBeCloseTo(1_425.6, 8);
  });

  it("requires at least one area", () => {
    expect(validateValues(definition, { ...getDefaultValues(definition), l1: 0, l2: 0 }).ok).toBe(false);
  });
});
