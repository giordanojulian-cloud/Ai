import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues } from "../../engine/values";
import definition from "./definition";

const compute = (overrides: Record<string, unknown>) => {
  const v = validateValues(definition, { ...getDefaultValues(definition), ...overrides });
  expect(v.ok).toBe(true);
  return definition.compute(v.values as never);
};

describe("markup calculator", () => {
  it("prices from markup", () => {
    const r = compute({ mode: "markup", cost: 40, markup: 50 });
    expect(r.primary.value).toBe(60);
    expect(r.secondary.find((s) => s.label === "Gross margin")?.value).toBeCloseTo(33.3333, 3);
  });

  it("prices from margin", () => {
    const r = compute({ mode: "margin", cost: 40, margin: 40 });
    expect(r.primary.value).toBeCloseTo(66.6667, 3);
    expect(r.secondary.find((s) => s.label === "Markup")?.value).toBeCloseTo(66.6667, 3);
  });

  it("derives markup from a price", () => {
    const r = compute({ mode: "price", cost: 50, price: 100 });
    expect(r.primary.value).toBe(100);
    expect(r.secondary.find((s) => s.label === "Gross margin")?.value).toBe(50);
  });

  it("warns when price is below cost", () => {
    expect(compute({ mode: "price", cost: 50, price: 40 }).warnings?.length).toBe(1);
  });
});
