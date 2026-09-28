import { effectiveAnnualRate, equivalentMonthlyRate, type CompoundingFrequency } from "@/lib/finance";
import { simulateGrowth, type GrowthResult } from "../../shared/growth";

export interface CompoundInterestInput {
  principal: number;
  monthlyContribution: number;
  ratePercent: number; // nominal annual
  frequency: CompoundingFrequency;
  years: number;
  timing: "start" | "end";
}

export interface CompoundInterestResult extends GrowthResult {
  effectiveAnnualRatePercent: number;
}

/**
 * Contributions are monthly while compounding may be any frequency, so we
 * convert the nominal rate to the equivalent monthly rate: (1+i)^12 = (1+r/n)^n.
 * For the principal this is exactly P(1 + r/n)^(n·t).
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const growth = simulateGrowth({
    initial: input.principal,
    monthlyRate: equivalentMonthlyRate(input.ratePercent, input.frequency),
    months: Math.round(input.years * 12),
    contribution: () => input.monthlyContribution,
    timing: input.timing,
  });
  return { ...growth, effectiveAnnualRatePercent: effectiveAnnualRate(input.ratePercent, input.frequency) * 100 };
}
