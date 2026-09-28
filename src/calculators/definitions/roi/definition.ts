import { formatCurrency, formatPercent } from "@/lib/format";
import { defineCalculator } from "../../types";
import { calculateRoi } from "./logic";

type Values = { invested: number; finalValue: number; income: number; costs: number; years: number };

export default defineCalculator<Values>({
  slug: "roi",
  groups: [
    { id: "main", label: "Investment" },
    { id: "more", label: "Income, costs & time", collapsible: false },
  ],
  fields: [
    { key: "invested", label: "Amount invested", type: "number", format: "currency", default: 10_000, min: 0.01, max: 1_000_000_000, step: 100, group: "main" },
    { key: "finalValue", param: "final", label: "Amount returned (final value)", type: "number", format: "currency", default: 15_000, min: 0, max: 1_000_000_000, step: 100, group: "main" },
    { key: "income", label: "Income received", type: "number", format: "currency", default: 0, min: 0, max: 1_000_000_000, step: 50, optional: true, group: "more", help: "Dividends, interest or rent collected." },
    { key: "costs", label: "Fees & other costs", type: "number", format: "currency", default: 0, min: 0, max: 1_000_000_000, step: 50, optional: true, group: "more" },
    { key: "years", label: "Holding period", type: "number", format: "number", default: 3, min: 0, max: 100, step: 0.5, suffix: "years", optional: true, group: "more", help: "Used to annualize the return. Enter 0 to skip." },
  ],
  compute: (v) => {
    const r = calculateRoi({ invested: v.invested, finalValue: v.finalValue, income: v.income, costs: v.costs, years: v.years });
    const tone = r.gain >= 0 ? ("positive" as const) : ("negative" as const);
    const perDollar = formatCurrency(Math.abs(r.roiPercent) / 100);
    const insights = [r.gain >= 0 ? `Every $1 you put in earned ${perDollar} of profit.` : `Every $1 you put in lost ${perDollar}.`];
    if (r.annualizedPercent !== null && v.years > 0) {
      insights.push(
        `Spread over ${v.years} ${v.years === 1 ? "year" : "years"}, that's equivalent to ${formatPercent(r.annualizedPercent)} per year compounded — the figure to compare against other investments.`,
      );
      if (v.years > 1) insights.push("Total ROI grows with time, so compare investments of different lengths using the annualized figure.");
    }
    return {
      primary: { label: "Return on investment", value: r.roiPercent, format: "percent", tone },
      secondary: [
        { label: "Net gain", value: r.gain, format: "currency", tone },
        ...(r.annualizedPercent !== null ? [{ label: "Annualized ROI", value: r.annualizedPercent, format: "percent" as const, tone }] : []),
        { label: "Total invested (with costs)", value: r.totalCost, format: "currency" },
        { label: "Total returned (with income)", value: r.totalReturn, format: "currency" },
      ],
      charts: [
        {
          id: "compare",
          title: "Invested vs. returned",
          kind: "bar",
          xKey: "label",
          series: [{ key: "value", label: "Amount", color: 1 }],
          data: [
            { label: "Invested", value: r.totalCost },
            { label: "Returned", value: r.totalReturn },
          ],
          valueFormat: "currency",
        },
      ],
      insights,
    };
  },
});
