import { formatCurrency, formatMonths } from "@/lib/format";
import { growthChart, growthTable } from "../../shared/growth";
import { defineCalculator } from "../../types";
import { calculateSavingsGoal } from "./logic";

type Values = { goal: number; current: number; years: number; apy: number };

export default defineCalculator<Values>({
  slug: "savings-goal",
  fields: [
    { key: "goal", label: "Savings goal", type: "number", format: "currency", default: 20_000, min: 1, max: 1_000_000_000, step: 500 },
    { key: "current", label: "Current savings", type: "number", format: "currency", default: 2_000, min: 0, max: 1_000_000_000, step: 500, optional: true },
    { key: "years", label: "Time to reach goal", type: "number", format: "number", default: 3, min: 0.25, max: 60, step: 0.5, suffix: "years", help: "Decimals allowed, e.g. 1.5 years." },
    { key: "apy", label: "Savings rate (APY)", type: "number", format: "percent", default: 4.5, min: 0, max: 20, step: 0.05 },
  ],
  compute: (v) => {
    const months = Math.max(1, Math.round(v.years * 12));
    const r = calculateSavingsGoal({ goal: v.goal, currentSavings: v.current, months, apyPercent: v.apy });
    const insights = r.alreadyOnTrack
      ? [`Your current savings are projected to grow to ${formatCurrency(r.currentSavingsFutureValue, 0)} on their own — enough to reach your goal without new deposits.`]
      : [
          `Saving ${formatCurrency(r.monthlyContribution)} a month for ${formatMonths(months)} reaches ${formatCurrency(v.goal, 0)}.`,
          `Interest contributes ${formatCurrency(r.interestEarned, 0)}, so you deposit ${formatCurrency(r.totalContributions, 0)} of new money.`,
          `Weekly, that's about ${formatCurrency((r.monthlyContribution * 12) / 52)} per week.`,
        ];
    return {
      primary: { label: "Save each month", value: r.monthlyContribution, format: "currency", hint: `For ${formatMonths(months)}` },
      secondary: [
        { label: "Total new deposits", value: r.totalContributions, format: "currencyWhole" },
        { label: "Interest earned", value: r.interestEarned, format: "currencyWhole", tone: "positive" },
        { label: "Current savings grow to", value: r.currentSavingsFutureValue, format: "currencyWhole" },
        { label: "Weekly equivalent", value: (r.monthlyContribution * 12) / 52, format: "currency" },
      ],
      charts: [growthChart(r.years, { contributions: "Your deposits", growth: "Interest" })],
      tables: [growthTable(r.years, "Interest")],
      insights,
    };
  },
});
