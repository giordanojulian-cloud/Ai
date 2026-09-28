/**
 * Interest-rate conversions. All public functions take rates in percent units
 * (6.5 means 6.5%) because that is what users type; internals use decimals.
 */

export type CompoundingFrequency = "annually" | "semiannually" | "quarterly" | "monthly" | "daily" | "continuously";

export const COMPOUNDS_PER_YEAR: Record<Exclude<CompoundingFrequency, "continuously">, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

/** Nominal annual rate (APR-style) → simple monthly rate: r / 12. Used for loans. */
export function monthlyRateFromApr(aprPercent: number): number {
  return aprPercent / 100 / 12;
}

/** Nominal annual rate compounded `frequency` → effective annual yield (APY), as a decimal. */
export function effectiveAnnualRate(nominalPercent: number, frequency: CompoundingFrequency): number {
  const r = nominalPercent / 100;
  if (frequency === "continuously") return Math.exp(r) - 1;
  const n = COMPOUNDS_PER_YEAR[frequency];
  return (1 + r / n) ** n - 1;
}

/**
 * Monthly rate that produces the same growth as the nominal rate compounded at
 * `frequency`. Lets us model monthly contributions under any compounding
 * schedule: (1 + i)^12 = (1 + r/n)^n.
 */
export function equivalentMonthlyRate(nominalPercent: number, frequency: CompoundingFrequency): number {
  return (1 + effectiveAnnualRate(nominalPercent, frequency)) ** (1 / 12) - 1;
}

/** Effective annual rate (e.g. an average annual return or an APY) → equivalent monthly rate. */
export function monthlyRateFromEffectiveAnnual(effectivePercent: number): number {
  return (1 + effectivePercent / 100) ** (1 / 12) - 1;
}
