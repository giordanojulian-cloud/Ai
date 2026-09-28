import { describe, expect, it } from "vitest";
import { marginToMarkup, markupToMargin, priceFromMargin, priceFromMarkup } from "../../shared/pricing";
import { calculateProfit } from "./logic";

describe("calculateProfit", () => {
  it("matches the documented example", () => {
    const r = calculateProfit({ revenue: 100_000, cogs: 60_000, operatingExpenses: 25_000, taxRatePercent: 21 });
    expect(r.grossProfit).toBe(40_000);
    expect(r.grossMargin).toBe(40);
    expect(r.markup).toBeCloseTo(66.6667, 3);
    expect(r.operatingMargin).toBe(15);
    expect(r.taxes).toBeCloseTo(3_150, 8);
    expect(r.netProfit).toBeCloseTo(11_850, 8);
    expect(r.netMargin).toBeCloseTo(11.85, 8);
  });

  it("does not tax losses", () => {
    const r = calculateProfit({ revenue: 100, cogs: 80, operatingExpenses: 50, taxRatePercent: 21 });
    expect(r.taxes).toBe(0);
    expect(r.netMargin).toBe(-30);
  });
});

describe("pricing conversions", () => {
  it("converts margin and markup", () => {
    expect(markupToMargin(50)).toBeCloseTo(33.3333, 3);
    expect(marginToMarkup(40)).toBeCloseTo(66.6667, 3);
    expect(markupToMargin(marginToMarkup(27))).toBeCloseTo(27, 10);
  });

  it("prices from margin and markup", () => {
    expect(priceFromMarkup(40, 50)).toBe(60);
    expect(priceFromMargin(30, 40)).toBeCloseTo(50, 10);
  });
});
