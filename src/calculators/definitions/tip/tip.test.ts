import { describe, expect, it } from "vitest";
import { calculateTip } from "./logic";

describe("calculateTip", () => {
  it("matches the documented example", () => {
    const r = calculateTip({ subtotal: 85, tax: 7.23, tipPercent: 18, people: 2, roundUp: false });
    expect(r.tip).toBeCloseTo(15.3, 10);
    expect(r.total).toBeCloseTo(107.53, 10);
    expect(r.perPerson).toBeCloseTo(53.765, 10);
  });

  it("rounds shares up and adds the difference to the tip", () => {
    const r = calculateTip({ subtotal: 85, tax: 7.23, tipPercent: 18, people: 2, roundUp: true });
    expect(r.perPerson).toBe(54);
    expect(r.total).toBe(108);
    expect(r.tip).toBeCloseTo(15.77, 10);
  });

  it("does not round up exact amounts", () => {
    expect(calculateTip({ subtotal: 100, tax: 0, tipPercent: 20, people: 4, roundUp: true }).perPerson).toBe(30);
  });
});
