import { monthlyRateFromEffectiveAnnual } from "@/lib/finance";
import { simulateGrowth, type GrowthResult } from "../../shared/growth";

export interface InvestmentGrowthInput {
  initial: number;
  monthlyContribution: number;
  /** Expected average annual return, as an effective annual rate. */
  returnPercent: number;
  years: number;
  /** Yearly increase applied to the monthly contribution (e.g. raises). */
  contributionIncreasePercent: number;
  inflationPercent: number;
  /** Annual fees (expense ratio / advisory fee) as a percent of assets. */
  feePercent: number;
}

export interface InvestmentGrowthResult extends GrowthResult {
  netReturnPercent: number;
  realBalance: number;
  /** Balance lost to fees versus the same plan with no fees. */
  feeDrag: number;
}

/** Net annual return after an asset-based fee: (1 + r)(1 − f) − 1. */
export function netOfFees(returnPercent: number, feePercent: number): number {
  return ((1 + returnPercent / 100) * (1 - feePercent / 100) - 1) * 100;
}

function run(input: InvestmentGrowthInput, annualReturnPercent: number): GrowthResult {
  return simulateGrowth({
    initial: input.initial,
    monthlyRate: monthlyRateFromEffectiveAnnual(annualReturnPercent),
    months: Math.round(input.years * 12),
    contribution: (month) => input.monthlyContribution * (1 + input.contributionIncreasePercent / 100) ** Math.floor((month - 1) / 12),
  });
}

export function calculateInvestmentGrowth(input: InvestmentGrowthInput): InvestmentGrowthResult {
  const netReturnPercent = netOfFees(input.returnPercent, input.feePercent);
  const growth = run(input, netReturnPercent);
  const withoutFees = input.feePercent > 0 ? run(input, input.returnPercent).balance : growth.balance;
  return {
    ...growth,
    netReturnPercent,
    realBalance: growth.balance / (1 + input.inflationPercent / 100) ** input.years,
    feeDrag: withoutFees - growth.balance,
  };
}
