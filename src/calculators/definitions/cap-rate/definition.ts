import { formatCurrency, formatPercent } from "@/lib/format";
import { capRate, effectiveGrossIncome, netOperatingIncome, valueFromCapRate } from "../../shared/property";
import { defineCalculator } from "../../types";

type Values = { mode: string; value: number; income: number; vacancy: number; expenses: number; targetCap: number };

export default defineCalculator<Values>({
  slug: "cap-rate",
  fields: [
    {
      key: "mode",
      label: "I want to find",
      type: "select",
      display: "segmented",
      default: "rate",
      fullWidth: true,
      options: [
        { value: "rate", label: "Cap rate" },
        { value: "value", label: "Property value" },
      ],
    },
    { key: "value", label: "Property value or price", type: "number", format: "currency", default: 1_000_000, min: 1, max: 10_000_000_000, step: 5_000, visibleWhen: (v) => v.mode === "rate" },
    { key: "targetCap", label: "Market cap rate", type: "number", format: "percent", default: 6.5, min: 0.1, max: 30, step: 0.05, visibleWhen: (v) => v.mode === "value", help: "Cap rate for comparable properties in the market." },
    { key: "income", label: "Gross annual income", type: "number", format: "currency", default: 120_000, min: 0, max: 1_000_000_000, step: 1_000, help: "Rent plus other income (parking, laundry…)." },
    { key: "vacancy", label: "Vacancy & credit loss", type: "number", format: "percent", default: 5, min: 0, max: 100, step: 0.5, optional: true },
    { key: "expenses", label: "Annual operating expenses", type: "number", format: "currency", default: 40_000, min: 0, max: 1_000_000_000, step: 500, optional: true, help: "Taxes, insurance, maintenance, management, utilities. Exclude mortgage payments." },
  ],
  compute: (v) => {
    const egi = effectiveGrossIncome(v.income, v.vacancy);
    const noi = netOperatingIncome(egi, v.expenses);
    const expenseRatio = egi > 0 ? (v.expenses / egi) * 100 : 0;
    const secondary = [
      { label: "Net operating income", value: noi, format: "currency" as const, hint: "per year" },
      { label: "Effective gross income", value: egi, format: "currency" as const, hint: "after vacancy" },
      { label: "Operating expense ratio", value: expenseRatio, format: "percent" as const, hint: "Expenses ÷ effective income" },
    ];

    if (v.mode === "value") {
      const value = valueFromCapRate(noi, v.targetCap);
      return {
        primary: { label: "Estimated property value", value, format: "currencyWhole", hint: `At a ${formatPercent(v.targetCap)} cap rate` },
        secondary,
        insights: [
          `An investor paying ${formatCurrency(value, 0)} for ${formatCurrency(noi, 0)} of NOI earns ${formatPercent(v.targetCap)} before financing.`,
          `Each 0.5-point change in the market cap rate moves the value to between ${formatCurrency(valueFromCapRate(noi, v.targetCap + 0.5), 0)} and ${formatCurrency(valueFromCapRate(noi, Math.max(0.1, v.targetCap - 0.5)), 0)}.`,
        ],
        warnings: noi <= 0 ? ["NOI is zero or negative, so an income-based value can't be estimated."] : [],
      };
    }

    const rate = capRate(noi, v.value);
    return {
      primary: { label: "Cap rate", value: rate, format: "percent", tone: rate >= 0 ? "default" : "negative" },
      secondary,
      insights: [
        `The property earns ${formatCurrency(noi, 0)} a year before financing — ${formatPercent(rate)} of its ${formatCurrency(v.value, 0)} value.`,
        "Cap rates are best used to compare similar properties in the same market; a higher cap rate usually signals higher income relative to price, and often higher risk.",
      ],
    };
  },
});
