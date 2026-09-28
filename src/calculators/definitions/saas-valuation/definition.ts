import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { defineCalculator } from "../../types";
import { valueSaas } from "./logic";

type Values = { mrr: number; growth: number; grossMargin: number; netMargin: number; churn: number; revenueMultiple: number; profitMultiple: number; spread: number };

export default defineCalculator<Values>({
  slug: "saas-valuation",
  groups: [
    { id: "metrics", label: "Business metrics" },
    { id: "multiples", label: "Valuation multiples", description: "Enter multiples from comparable deals or brokers. These drive the result." },
  ],
  fields: [
    { key: "mrr", label: "Monthly recurring revenue (MRR)", type: "number", format: "currency", default: 50_000, min: 1, max: 1_000_000_000, step: 1_000, group: "metrics" },
    { key: "growth", label: "Annual growth rate", type: "number", format: "percent", default: 40, min: -100, max: 1_000, step: 1, group: "metrics" },
    { key: "grossMargin", label: "Gross margin", type: "number", format: "percent", default: 80, min: -100, max: 100, step: 1, group: "metrics" },
    { key: "netMargin", label: "Net profit margin", type: "number", format: "percent", default: 15, min: -500, max: 100, step: 1, group: "metrics" },
    { key: "churn", label: "Monthly revenue churn", type: "number", format: "percent", default: 2, min: 0, max: 100, step: 0.1, group: "metrics" },
    { key: "revenueMultiple", param: "revx", label: "ARR multiple", type: "number", format: "number", default: 5, min: 0, max: 100, step: 0.5, suffix: "× ARR", group: "multiples" },
    { key: "profitMultiple", param: "profx", label: "Profit multiple", type: "number", format: "number", default: 15, min: 0, max: 200, step: 0.5, suffix: "× profit", group: "multiples" },
    { key: "spread", label: "Scenario range", type: "number", format: "percent", default: 25, min: 0, max: 90, step: 5, group: "multiples", help: "Conservative and aggressive scenarios adjust both multiples by this much." },
  ],
  compute: (v) => {
    const r = valueSaas({
      mrr: v.mrr,
      growthPercent: v.growth,
      grossMarginPercent: v.grossMargin,
      netMarginPercent: v.netMargin,
      monthlyChurnPercent: v.churn,
      revenueMultiple: v.revenueMultiple,
      profitMultiple: v.profitMultiple,
      scenarioSpreadPercent: v.spread,
    });
    const insights = [
      `At ${formatNumber(v.revenueMultiple, 1)}× ARR the business would be valued around ${formatCurrency(r.revenueValuation, 0)}; at ${formatNumber(v.profitMultiple, 1)}× profit, around ${formatCurrency(r.profitValuation, 0)}. Buyers usually lean on revenue multiples for fast-growing companies and profit multiples for mature ones.`,
      `Growth plus profit margin (the "Rule of 40") is ${formatPercent(r.ruleOf40, 0)}. ${r.ruleOf40 >= 40 ? "Companies at or above 40% often command higher multiples." : "Companies below 40% typically receive lower multiples."}`,
      `${formatPercent(v.churn)} monthly churn compounds to ${formatPercent(r.annualChurnPercent, 1)} of revenue lost per year, which buyers weigh heavily.`,
    ];
    return {
      primary: { label: "Estimated valuation (ARR multiple)", value: r.revenueValuation, format: "currencyWhole", hint: `${formatNumber(v.revenueMultiple, 1)}× ${formatCurrency(r.arr, 0)} ARR` },
      secondary: [
        { label: "Annual recurring revenue", value: r.arr, format: "currencyWhole" },
        { label: "Annual profit", value: r.annualProfit, format: "currencyWhole", tone: r.annualProfit >= 0 ? "default" : "negative" },
        { label: "Profit-based valuation", value: r.profitValuation, format: "currencyWhole", hint: `${formatNumber(v.profitMultiple, 1)}× annual profit` },
        { label: "ARR in 12 months", value: r.forwardArr, format: "currencyWhole", hint: `At ${formatPercent(v.growth, 0)} growth` },
        { label: "Annualized churn", value: r.annualChurnPercent, format: "percent" },
        { label: "Rule of 40 score", value: r.ruleOf40, format: "percent", hint: "Growth + net margin" },
      ],
      sections: r.scenarios.map((s) => ({
        title: `${s.label} scenario`,
        items: [
          { label: `Revenue-based (${formatNumber(s.revenueMultiple, 2)}×)`, value: s.revenueValuation, format: "currencyWhole" as const },
          { label: `Profit-based (${formatNumber(s.profitMultiple, 2)}×)`, value: s.profitValuation, format: "currencyWhole" as const },
        ],
      })),
      charts: [
        {
          id: "scenarios",
          title: "Valuation scenarios",
          kind: "bar",
          xKey: "scenario",
          series: [
            { key: "revenue", label: "Revenue-based", color: 1 },
            { key: "profit", label: "Profit-based", color: 2 },
          ],
          data: r.scenarios.map((s) => ({ scenario: s.label, revenue: s.revenueValuation, profit: s.profitValuation })),
          valueFormat: "currencyWhole",
        },
      ],
      insights,
      warnings: [
        "This is a simplified estimate based on the multiples you enter — not a professional business valuation. Real transactions depend on growth quality, retention, customer concentration, market conditions and deal terms.",
      ],
    };
  },
});
