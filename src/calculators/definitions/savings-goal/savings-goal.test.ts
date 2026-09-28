import { describe, expect, it } from "vitest";
import { calculateSavingsGoal } from "./logic";

describe("calculateSavingsGoal", () => {
  it("matches the documented example", () => {
    const r = calculateSavingsGoal({ goal: 20_000, currentSavings: 2_000, months: 36, apyPercent: 4.5 });
    expect(r.monthlyContribution).toBeCloseTo(461.22, 2);
    expect(r.currentSavingsFutureValue).toBeCloseTo(2_282.33, 2);
    expect(r.years.at(-1)?.balance).toBeCloseTo(20_000, 6);
    expect(r.interestEarned).toBeCloseTo(1_395.97, 1);
  });

  it("divides evenly at 0%", () => {
    const r = calculateSavingsGoal({ goal: 12_000, currentSavings: 0, months: 12, apyPercent: 0 });
    expect(r.monthlyContribution).toBe(1_000);
  });

  it("returns zero when current savings already reach the goal", () => {
    const r = calculateSavingsGoal({ goal: 10_000, currentSavings: 9_900, months: 24, apyPercent: 5 });
    expect(r.alreadyOnTrack).toBe(true);
    expect(r.monthlyContribution).toBe(0);
  });
});
