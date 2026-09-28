import { describe, expect, it } from "vitest";
import { calculateRoi } from "./logic";

const base = { invested: 10_000, finalValue: 15_000, income: 0, costs: 0, years: 3 };

describe("calculateRoi", () => {
  it("matches the documented example", () => {
    const r = calculateRoi(base);
    expect(r.gain).toBe(5_000);
    expect(r.roiPercent).toBe(50);
    expect(r.annualizedPercent).toBeCloseTo(14.4714, 3);
  });

  it("includes income and costs", () => {
    const r = calculateRoi({ ...base, income: 300, costs: 200 });
    expect(r.gain).toBe(5_100);
    expect(r.roiPercent).toBeCloseTo(50, 10);
  });

  it("handles losses", () => {
    const r = calculateRoi({ ...base, finalValue: 5_000 });
    expect(r.roiPercent).toBe(-50);
    expect(r.annualizedPercent).toBeCloseTo((0.5 ** (1 / 3) - 1) * 100, 8);
  });

  it("handles a total loss", () => {
    const r = calculateRoi({ ...base, finalValue: 0 });
    expect(r.roiPercent).toBe(-100);
    expect(r.annualizedPercent).toBe(-100);
  });

  it("skips annualization without a holding period", () => {
    expect(calculateRoi({ ...base, years: 0 }).annualizedPercent).toBeNull();
  });
});
