import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { defineCalculator } from "../../types";
import { calculateBreakEven } from "./logic";

type Values = { fixed: number; price: number; variable: number; target: number };

export default defineCalculator<Values>({
  slug: "break-even",
  fields: [
    { key: "fixed", label: "Fixed costs", type: "number", format: "currency", default: 50_000, min: 0, max: 100_000_000_000, step: 500, help: "Costs that don't change with volume (rent, salaries, insurance) for the period." },
    { key: "price", label: "Price per unit", type: "number", format: "currency", default: 80, min: 0.01, max: 100_000_000, step: 1 },
    { key: "variable", label: "Variable cost per unit", type: "number", format: "currency", default: 30, min: 0, max: 100_000_000, step: 1, help: "Materials, shipping, payment fees, commissions per unit." },
    { key: "target", label: "Target profit (optional)", type: "number", format: "currency", default: 20_000, min: 0, max: 100_000_000_000, step: 500, optional: true },
  ],
  validate: (v) => (v.variable >= v.price ? { variable: "Variable cost must be lower than the price, or every sale loses money." } : {}),
  compute: (v) => {
    const r = calculateBreakEven({ fixedCosts: v.fixed, pricePerUnit: v.price, variableCostPerUnit: v.variable, targetProfit: v.target });
    const unitsToSell = Math.ceil(r.breakEvenUnits - 1e-9);
    const maxUnits = Math.max(10, Math.ceil(Math.max(r.breakEvenUnits, r.unitsForTarget) * 1.5));
    const step = Math.max(1, Math.ceil(maxUnits / 20));
    const data = Array.from({ length: Math.floor(maxUnits / step) + 1 }, (_, i) => {
      const units = i * step;
      return { units, revenue: units * v.price, costs: v.fixed + units * v.variable };
    });
    return {
      primary: { label: "Break-even point", value: unitsToSell, format: "integer", hint: `units (${formatCurrency(r.breakEvenRevenue, 0)} in sales)` },
      secondary: [
        { label: "Break-even revenue", value: r.breakEvenRevenue, format: "currency" },
        { label: "Contribution margin", value: r.contributionMargin, format: "currency", hint: "per unit" },
        { label: "Contribution margin ratio", value: r.contributionMarginRatio, format: "percent" },
        ...(v.target > 0
          ? [
              { label: "Units for target profit", value: Math.ceil(r.unitsForTarget - 1e-9), format: "integer" as const, hint: `${formatCurrency(v.target, 0)} profit` },
              { label: "Revenue for target profit", value: r.revenueForTarget, format: "currency" as const },
            ]
          : []),
      ],
      charts: [
        {
          id: "cvp",
          title: "Revenue vs. total costs",
          description: "The lines cross at the break-even point.",
          kind: "line",
          xKey: "units",
          xLabel: "Units",
          series: [
            { key: "revenue", label: "Revenue", color: 1 },
            { key: "costs", label: "Total costs", color: 3 },
          ],
          data,
          valueFormat: "currencyWhole",
        },
      ],
      insights: [
        `Each unit contributes ${formatCurrency(r.contributionMargin)} toward fixed costs. It takes ${formatNumber(r.breakEvenUnits, 2)} units to cover ${formatCurrency(v.fixed, 0)}, so you need to sell ${formatNumber(unitsToSell, 0)} to break even.`,
        `${formatPercent(r.contributionMarginRatio)} of every sales dollar goes toward fixed costs and profit.`,
        `Raising the price by 10% would lower break-even to ${formatNumber(Math.ceil(v.fixed / (v.price * 1.1 - v.variable) - 1e-9), 0)} units, assuming sales volume holds.`,
      ],
    };
  },
});
