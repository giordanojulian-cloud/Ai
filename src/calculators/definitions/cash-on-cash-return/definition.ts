import { formatCurrency, formatPercent } from "@/lib/format";
import { cashOnCash, effectiveGrossIncome, netOperatingIncome } from "../../shared/property";
import { defineCalculator } from "../../types";

type Values = { down: number; closing: number; rehab: number; rent: number; vacancy: number; expenses: number; mortgage: number };

export default defineCalculator<Values>({
  slug: "cash-on-cash-return",
  groups: [
    { id: "cash", label: "Cash invested" },
    { id: "income", label: "Annual income & costs" },
  ],
  fields: [
    { key: "down", label: "Down payment", type: "number", format: "currency", default: 60_000, min: 0, max: 1_000_000_000, step: 1_000, group: "cash" },
    { key: "closing", label: "Closing costs", type: "number", format: "currency", default: 6_000, min: 0, max: 100_000_000, step: 500, group: "cash", optional: true },
    { key: "rehab", label: "Repairs & other upfront costs", type: "number", format: "currency", default: 4_000, min: 0, max: 100_000_000, step: 500, group: "cash", optional: true },
    { key: "rent", label: "Gross annual rent", type: "number", format: "currency", default: 30_000, min: 0, max: 1_000_000_000, step: 500, group: "income" },
    { key: "vacancy", label: "Vacancy rate", type: "number", format: "percent", default: 5, min: 0, max: 100, step: 0.5, group: "income", optional: true },
    { key: "expenses", label: "Annual operating expenses", type: "number", format: "currency", default: 9_000, min: 0, max: 1_000_000_000, step: 250, group: "income", optional: true, help: "Taxes, insurance, maintenance, management — not the mortgage." },
    { key: "mortgage", label: "Monthly mortgage payment", type: "number", format: "currency", default: 1_300, min: 0, max: 10_000_000, step: 25, group: "income", optional: true, help: "Principal and interest. Enter 0 for an all-cash purchase." },
  ],
  validate: (v) => (v.down + v.closing + v.rehab <= 0 ? { down: "Enter the cash you invested." } : {}),
  compute: (v) => {
    const invested = v.down + v.closing + v.rehab;
    const egi = effectiveGrossIncome(v.rent, v.vacancy);
    const noi = netOperatingIncome(egi, v.expenses);
    const debt = v.mortgage * 12;
    const cashFlow = noi - debt;
    const coc = cashOnCash(cashFlow, invested);
    const tone = cashFlow >= 0 ? ("positive" as const) : ("negative" as const);
    return {
      primary: { label: "Cash-on-cash return", value: coc, format: "percent", tone, hint: "Annual pre-tax cash flow ÷ cash invested" },
      secondary: [
        { label: "Annual cash flow", value: cashFlow, format: "currency", tone },
        { label: "Monthly cash flow", value: cashFlow / 12, format: "currency", tone },
        { label: "Total cash invested", value: invested, format: "currency" },
        { label: "Net operating income", value: noi, format: "currency" },
        { label: "Annual debt service", value: debt, format: "currency" },
        { label: "Years to recoup cash", value: cashFlow > 0 ? invested / cashFlow : Infinity, format: "years", hint: "From cash flow alone" },
      ],
      insights: [
        cashFlow >= 0
          ? `Each year, the property returns ${formatCurrency(cashFlow, 0)} in cash on the ${formatCurrency(invested, 0)} you put in — ${formatPercent(coc)}.`
          : `The mortgage payment exceeds net operating income by ${formatCurrency(-cashFlow, 0)} a year, so cash-on-cash return is negative.`,
        "Cash-on-cash return excludes loan paydown, appreciation and tax benefits, so it understates total return on most leveraged rentals.",
      ],
    };
  },
});
