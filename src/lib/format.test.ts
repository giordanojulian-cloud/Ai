import { describe, expect, it } from "vitest";
import { formatCurrency, formatMonths, formatPercent, formatValue, roundTo } from "./format";

describe("roundTo", () => {
  it("rounds half away from zero without binary artifacts", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(2.675, 2)).toBe(2.68);
    expect(roundTo(-1.005, 2)).toBe(-1.01);
    expect(roundTo(0.1 + 0.2, 2)).toBe(0.3);
  });

  it("never returns negative zero", () => {
    expect(Object.is(roundTo(-0.0001, 2), 0)).toBe(true);
  });

  it("passes through non-finite values", () => {
    expect(roundTo(Infinity)).toBe(Infinity);
    expect(Number.isNaN(roundTo(NaN))).toBe(true);
  });
});

describe("formatting", () => {
  it("formats currency with fixed decimals", () => {
    expect(formatCurrency(2528.2714)).toBe("$2,528.27");
    expect(formatCurrency(1234567.5, 0)).toBe("$1,234,568");
    expect(formatCurrency(-0.001)).toBe("$0.00");
  });

  it("formats percent units", () => {
    expect(formatPercent(6.5)).toBe("6.5%");
    expect(formatPercent(33.33333)).toBe("33.33%");
  });

  it("formats month durations", () => {
    expect(formatMonths(27)).toBe("2 years, 3 months");
    expect(formatMonths(12)).toBe("1 year");
    expect(formatMonths(1)).toBe("1 month");
    expect(formatMonths(0)).toBe("0 months");
  });

  it("renders non-finite values as an em dash", () => {
    expect(formatValue(Infinity, "currency")).toBe("—");
    expect(formatValue(3.456, "multiple")).toBe("3.46×");
  });
});
