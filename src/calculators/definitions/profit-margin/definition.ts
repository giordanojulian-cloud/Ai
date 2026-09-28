import { formatCurrency, formatPercent } from "@/lib/format";
import { defineCalculator } from "../../types";
import { calculateProfit } from "./logic";

type Values = { revenue: number; cogs: number; opex: number; tax: number };

export default defineCalculator<Values>({
  slug: "profit-margin",
  fields: [
    { key: "revenue", label: "Revenue", type: "number", format: "currency", default: 100_000, min: 0.01, max: 100_000_000_000, step: 1_000, help: "Total sales for the period." },
    { key: "cogs", label: "Cost of goods sold", type: "number", format: "currency", default: 60_000, min: 0, max: 100_000_000_000, step: 1_000, help: "Direct costs of what you sold." },
    { key: "opex", label: "Operating expenses", type: "number", format: "currency", default: 25_000, min: 0, max: 100_000_000_000, step: 1_000, optional: true, help: "Rent, salaries, marketing, software…" },
    { key: "tax", label: "Income tax rate", type: "number", format: "percent", default: 21, min: 0, max: 60, step: 0.5, optional: true },
  ],
  compute: (v) => {
    const r = calculateProfit({ revenue: v.revenue, cogs: v.cogs, operatingExpenses: v.opex, taxRatePercent: v.tax });
    const toneOf = (x: number) => (x >= 0 ? ("positive" as const) : ("negative" as const));
    return {
      primary: { label: "Gross profit margin", value: r.grossMargin, format: "percent", tone: toneOf(r.grossProfit), hint: `${formatCurrency(r.grossProfit, 0)} gross profit` },
      secondary: [
        { label: "Gross profit", value: r.grossProfit, format: "currency", tone: toneOf(r.grossProfit) },
        { label: "Markup on cost", value: r.markup, format: "percent" },
        { label: "Operating profit", value: r.operatingProfit, format: "currency", tone: toneOf(r.operatingProfit) },
        { label: "Operating margin", value: r.operatingMargin, format: "percent", tone: toneOf(r.operatingProfit) },
        { label: "Net profit", value: r.netProfit, format: "currency", tone: toneOf(r.netProfit), hint: `After ${formatCurrency(r.taxes, 0)} tax` },
        { label: "Net profit margin", value: r.netMargin, format: "percent", tone: toneOf(r.netProfit) },
      ],
      charts: [
        {
          id: "breakdown",
          title: "Where each dollar of revenue goes",
          kind: "donut",
          xKey: "label",
          series: [{ key: "value", label: "Amount" }],
          data: [
            { label: "Cost of goods sold", value: v.cogs },
            { label: "Operating expenses", value: v.opex },
            { label: "Taxes", value: r.taxes },
            { label: "Net profit", value: Math.max(0, r.netProfit) },
          ].filter((d) => d.value > 0),
          valueFormat: "currency",
        },
      ],
      insights: [
        `Out of every $1 of revenue, ${formatCurrency(v.cogs / v.revenue)} covers direct costs and ${formatCurrency(Math.max(0, r.netProfit) / v.revenue)} ends up as net profit.`,
        `A ${formatPercent(r.grossMargin)} margin is a ${formatPercent(r.markup)} markup on cost — the two are often confused when setting prices.`,
      ],
    };
  },
});
