/**
 * FHA program parameters. HUD changes these periodically — update this file
 * (and `effectiveDate`) when a new Mortgagee Letter is issued. Nothing else in
 * the calculator hardcodes FHA rules.
 */
export const FHA_RULES = {
  effectiveDate: "2023-03-20",
  source: "HUD Mortgagee Letter 2023-05 (annual MIP reduction)",
  sourceUrl: "https://www.hud.gov/program_offices/administration/hudclips/letters/mortgagee",
  /** Minimum down payment for borrowers with credit scores of 580+. */
  minDownPaymentPercent: 3.5,
  /** Upfront MIP as a percent of the base loan amount. */
  upfrontMipPercent: 1.75,
  /** Base loan amount above which higher annual MIP rates apply. */
  highBalanceThreshold: 726_200,
  /** Annual MIP is paid for 11 years when LTV ≤ 90%, otherwise for the life of the loan. */
  elevenYearMipMaxLtv: 90,
  elevenYearMipMonths: 132,
} as const;

interface MipBand {
  maxLtv: number; // inclusive upper bound, percent
  rateBps: number;
}

/** Annual MIP by term and base loan amount, in basis points. */
const ANNUAL_MIP_TABLE: { longTerm: boolean; highBalance: boolean; bands: MipBand[] }[] = [
  { longTerm: true, highBalance: false, bands: [{ maxLtv: 95, rateBps: 50 }, { maxLtv: Infinity, rateBps: 55 }] },
  { longTerm: true, highBalance: true, bands: [{ maxLtv: 95, rateBps: 70 }, { maxLtv: Infinity, rateBps: 75 }] },
  { longTerm: false, highBalance: false, bands: [{ maxLtv: 90, rateBps: 15 }, { maxLtv: Infinity, rateBps: 40 }] },
  {
    longTerm: false,
    highBalance: true,
    bands: [{ maxLtv: 78, rateBps: 15 }, { maxLtv: 90, rateBps: 40 }, { maxLtv: Infinity, rateBps: 65 }],
  },
];

/** Annual MIP rate (percent) for a loan. "Long term" means a term over 15 years. */
export function annualMipRate(termYears: number, baseLoanAmount: number, ltvPercent: number): number {
  const longTerm = termYears > 15;
  const highBalance = baseLoanAmount > FHA_RULES.highBalanceThreshold;
  const row = ANNUAL_MIP_TABLE.find((r) => r.longTerm === longTerm && r.highBalance === highBalance)!;
  const band = row.bands.find((b) => ltvPercent <= b.maxLtv)!;
  return band.rateBps / 100;
}

/** Months annual MIP is charged: 11 years at ≤ 90% LTV, otherwise the full term. */
export function mipDurationMonths(termMonths: number, ltvPercent: number): number {
  return ltvPercent <= FHA_RULES.elevenYearMipMaxLtv ? Math.min(FHA_RULES.elevenYearMipMonths, termMonths) : termMonths;
}
