import { COMPOUNDS_PER_YEAR, effectiveAnnualRate, type CompoundingFrequency } from "@/lib/finance";

/** APY = (1 + r/n)^n − 1 (continuous: e^r − 1). Percent in, percent out. */
export function aprToApy(aprPercent: number, frequency: CompoundingFrequency): number {
  return effectiveAnnualRate(aprPercent, frequency) * 100;
}

/** Inverse: APR = n((1 + APY)^(1/n) − 1) (continuous: ln(1 + APY)). */
export function apyToApr(apyPercent: number, frequency: CompoundingFrequency): number {
  const apy = apyPercent / 100;
  if (frequency === "continuously") return Math.log(1 + apy) * 100;
  const n = COMPOUNDS_PER_YEAR[frequency];
  return n * ((1 + apy) ** (1 / n) - 1) * 100;
}
