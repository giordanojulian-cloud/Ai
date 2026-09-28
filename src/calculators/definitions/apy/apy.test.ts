import { describe, expect, it } from "vitest";
import { aprToApy, apyToApr } from "./logic";

describe("APY conversions", () => {
  it("matches known APYs", () => {
    expect(aprToApy(4.5, "daily")).toBeCloseTo(4.6025, 3);
    expect(aprToApy(4.5, "monthly")).toBeCloseTo(4.594, 3);
    expect(aprToApy(5, "annually")).toBeCloseTo(5, 10);
    expect(aprToApy(24, "daily")).toBeCloseTo(27.11, 1);
  });

  it("round-trips for every frequency", () => {
    for (const f of ["annually", "semiannually", "quarterly", "monthly", "daily", "continuously"] as const) {
      expect(apyToApr(aprToApy(6.25, f), f)).toBeCloseTo(6.25, 10);
    }
  });

  it("converts APY back to APR", () => {
    expect(apyToApr(5, "monthly")).toBeCloseTo(4.8889, 3);
  });

  it("handles zero", () => {
    expect(aprToApy(0, "daily")).toBe(0);
  });
});
