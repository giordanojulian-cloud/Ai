import { describe, expect, it } from "vitest";
import { calculateConcrete } from "./logic";

const slab = { shape: "slab" as const, lengthFt: 10, widthFt: 10, thicknessIn: 4, diameterIn: 0, heightFt: 0, quantity: 1, wastePercent: 10 };

describe("calculateConcrete", () => {
  it("matches the documented slab example", () => {
    const r = calculateConcrete(slab);
    expect(r.cubicFeet).toBeCloseTo(33.3333, 3);
    expect(r.cubicYards).toBeCloseTo(1.358, 3);
    expect(r.bags[80]).toBe(62);
    expect(r.bags[60]).toBe(82);
  });

  it("computes cylinder volume", () => {
    const r = calculateConcrete({ ...slab, shape: "column", diameterIn: 12, heightFt: 4, wastePercent: 0 });
    expect(r.cubicFeet).toBeCloseTo(Math.PI * 0.25 * 4, 10);
  });

  it("uses 45 bags of 80 lb per cubic yard", () => {
    const r = calculateConcrete({ ...slab, lengthFt: 27, widthFt: 1, thicknessIn: 12, wastePercent: 0 });
    expect(r.cubicYards).toBeCloseTo(1, 10);
    expect(r.bags[80]).toBe(45);
  });
});
