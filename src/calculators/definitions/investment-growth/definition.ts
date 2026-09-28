import { formatCurrency, formatPercent } from "@/lib/format";
import { growthChart, growthTable } from "../../shared/growth";
import { defineCalculator } from "../../types";
import { calculateInvestmentGrowth } from "./logic";

type Values = {
  initial: number;
  monthly: number;
  returnRate: number;
  years: number;
  increase: number;
  inflation: number;
  fees: number;
};

export default defineCalculator<Values>({
  slug: "investment-growth",
  groups: [
    { id: "plan", label: "Your plan" },
    { id: "advanced", label: "Inflation, fees & raises", collapsible: true },
  ],
  fields: [
    { key: "initial", label: "Starting amount", type: "number", format: "currency", default: 25_000, min: 0, max: 1_000_000_000, step: 1_000, group: "plan" },
    { key: "monthly", label: "Monthly contribution", type: "number", format: "currency", default: 500, min: 0, max: 10_000_000, step: 50, group: "plan", optional: true },
    { key: "returnRate", param: "return", label: "Expected annual return", type: "number", format: "percent", default: 7, min: -20, max: 30, step: 0.25, group: "plan", help: "Long-run average, before inflation." },
    { key: "years", label: "Years invested", type: "number", format: "integer", default: 25, min: 1, max: 80, step: 1, suffix: "years", group: "plan" },
    { key: "increase", label: "Increase contributions each year", type: "number", format: "percent", default: 0, min: 0, max: 50, step: 0.5, group: "advanced", optional: true },
    { key: "inflation", label: "Inflation rate", type: "number", format: "percent", default: 2.5, min: 0, max: 20, step: 0.1, group: "advanced", optional: true },
    { key: "fees", label: "Annual fees", type: "number", format: "percent", default: 0.2, min: 0, max: 5, step: 0.05, group: "advanced", optional: true, help: "Fund expense ratios plus any advisory fee." },
  ],
  compute: (v) => {
    const r = calculateInvestmentGrowth({
      initial: v.initial,
      monthlyContribution: v.monthly,
      returnPercent: v.returnRate,
      years: v.years,
      contributionIncreasePercent: v.increase,
      inflationPercent: v.inflation,
      feePercent: v.fees,
    });
    const invested = v.initial + r.totalContributions;
    const insights = [
      `You invest ${formatCurrency(invested, 0)} of your own money; ${r.totalGrowth >= 0 ? "growth adds" : "losses subtract"} ${formatCurrency(Math.abs(r.totalGrowth), 0)}.`,
      `In today's dollars (after ${formatPercent(v.inflation, 1)} inflation), the final balance is worth about ${formatCurrency(r.realBalance, 0)}.`,
    ];
    if (r.feeDrag > 1) insights.push(`Fees of ${formatPercent(v.fees)} a year reduce the final balance by about ${formatCurrency(r.feeDrag, 0)}.`);
    return {
      primary: { label: `Projected value in ${v.years} years`, value: r.balance, format: "currencyWhole" },
      secondary: [
        { label: "Inflation-adjusted value", value: r.realBalance, format: "currencyWhole", hint: "In today's dollars" },
        { label: "Total invested", value: invested, format: "currencyWhole" },
        { label: "Investment growth", value: r.totalGrowth, format: "currencyWhole", tone: r.totalGrowth >= 0 ? "positive" : "negative" },
        { label: "Net annual return", value: r.netReturnPercent, format: "percent", hint: "After fees" },
        ...(v.fees > 0 ? [{ label: "Cost of fees", value: r.feeDrag, format: "currencyWhole" as const, tone: "negative" as const }] : []),
      ],
      charts: [growthChart(r.years, { contributions: "Amount invested", growth: "Growth" })],
      tables: [growthTable(r.years, "Growth")],
      insights,
    };
  },
});
