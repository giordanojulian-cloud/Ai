import { monthlyRateFromEffectiveAnnual } from "@/lib/finance";
import { simulateGrowth, type GrowthYear } from "../../shared/growth";

export interface SavingsGoalInput {
  goal: number;
  currentSavings: number;
  months: number;
  /** Savings APY (effective annual rate). */
  apyPercent: number;
}

export interface SavingsGoalResult {
  monthlyContribution: number;
  totalContributions: number;
  interestEarned: number;
  /** Current savings grown to the goal date on its own. */
  currentSavingsFutureValue: number;
  alreadyOnTrack: boolean;
  years: GrowthYear[];
}

/**
 * Required end-of-month deposit to reach a goal:
 *   PMT = (FV − PV(1 + i)^n) × i ÷ ((1 + i)^n − 1)
 * where i is the monthly rate equivalent to the APY.
 */
export function calculateSavingsGoal({ goal, currentSavings, months, apyPercent }: SavingsGoalInput): SavingsGoalResult {
  const i = monthlyRateFromEffectiveAnnual(apyPercent);
  const growth = (1 + i) ** months;
  const pvFuture = currentSavings * growth;
  const shortfall = goal - pvFuture;
  const alreadyOnTrack = shortfall <= 0;
  const monthlyContribution = alreadyOnTrack ? 0 : i === 0 ? shortfall / months : (shortfall * i) / (growth - 1);

  const sim = simulateGrowth({ initial: currentSavings, monthlyRate: i, months, contribution: () => monthlyContribution });
  return {
    monthlyContribution,
    totalContributions: monthlyContribution * months,
    interestEarned: sim.totalGrowth,
    currentSavingsFutureValue: pvFuture,
    alreadyOnTrack,
    years: sim.years,
  };
}
