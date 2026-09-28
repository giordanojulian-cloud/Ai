import type { CompoundingFrequency } from "@/lib/finance";
import { formatCurrency, formatPercent } from "@/lib/format";
import { growthChart, growthTable } from "../../shared/growth";
import { defineCalculator } from "../../types";
import { calculateCompoundInterest } from "./logic";

type Values = {
  principal: number;
  contribution: number;
  rate: number;
  frequency: string;
  years: number;
  timing: string;
};

export default defineCalculator<Values>({
  slug: "compound-interest",
  fields: [
    { key: "principal", label: "Initial deposit", type: "number", format: "currency", default: 10_000, min: 0, max: 100_000_000, step: 500 },
    { key: "contribution", param: "monthly", label: "Monthly contribution", type: "number", format: "currency", default: 200, min: 0, max: 10_000_000, step: 50, optional: true },
    { key: "rate", label: "Annual interest rate", type: "number", format: "percent", default: 7, min: 0, max: 50, step: 0.1 },
    { key: "years", label: "Years to grow", type: "number", format: "integer", default: 10, min: 1, max: 100, step: 1, suffix: "years" },
    {
      key: "frequency",
      param: "freq",
      label: "Compounding frequency",
      type: "select",
      default: "monthly",
      options: [
        { value: "annually", label: "Annually" },
        { value: "semiannually", label: "Semiannually" },
        { value: "quarterly", label: "Quarterly" },
        { value: "monthly", label: "Monthly" },
        { value: "daily", label: "Daily" },
        { value: "continuously", label: "Continuously" },
      ],
    },
    {
      key: "timing",
      label: "Contributions made at",
      type: "select",
      display: "segmented",
      default: "end",
      options: [
        { value: "end", label: "End of month" },
        { value: "start", label: "Start of month" },
      ],
    },
  ],
  compute: (v) => {
    const r = calculateCompoundInterest({
      principal: v.principal,
      monthlyContribution: v.contribution,
      ratePercent: v.rate,
      frequency: v.frequency as CompoundingFrequency,
      years: v.years,
      timing: v.timing as "start" | "end",
    });
    const contributed = v.principal + r.totalContributions;
    const insights = [
      `You contribute ${formatCurrency(contributed, 0)} in total; compounding adds ${formatCurrency(r.totalGrowth, 0)} on top.`,
    ];
    if (contributed > 0 && r.totalGrowth > 0) {
      insights.push(`Interest makes up ${formatPercent((r.totalGrowth / r.balance) * 100, 0)} of the final balance.`);
    }
    const lastYear = r.years.at(-1);
    if (lastYear && v.years > 1) {
      insights.push(`In the final year alone, interest earns ${formatCurrency(lastYear.growth, 0)} — compounding accelerates over time.`);
    }
    return {
      primary: { label: `Balance after ${v.years} ${v.years === 1 ? "year" : "years"}`, value: r.balance, format: "currency" },
      secondary: [
        { label: "Total contributions", value: contributed, format: "currency", hint: "Initial deposit + monthly contributions" },
        { label: "Total interest earned", value: r.totalGrowth, format: "currency", tone: "positive" },
        { label: "Effective annual rate (APY)", value: r.effectiveAnnualRatePercent, format: "percent" },
        { label: "Monthly contribution", value: v.contribution, format: "currency" },
      ],
      charts: [growthChart(r.years, { contributions: "Contributions", growth: "Interest" })],
      tables: [growthTable(r.years, "Interest")],
      insights,
    };
  },
});
