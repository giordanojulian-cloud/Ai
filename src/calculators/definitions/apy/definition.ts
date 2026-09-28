import type { CompoundingFrequency } from "@/lib/finance";
import { formatCurrency, formatPercent } from "@/lib/format";
import { defineCalculator } from "../../types";
import { aprToApy, apyToApr } from "./logic";

type Values = { mode: string; rate: number; frequency: string; deposit: number };

const FREQUENCIES: { value: CompoundingFrequency; label: string }[] = [
  { value: "annually", label: "Annually" },
  { value: "semiannually", label: "Semiannually" },
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
  { value: "daily", label: "Daily" },
  { value: "continuously", label: "Continuously" },
];

export default defineCalculator<Values>({
  slug: "apy",
  fields: [
    {
      key: "mode",
      label: "Convert",
      type: "select",
      display: "segmented",
      default: "apr-to-apy",
      fullWidth: true,
      options: [
        { value: "apr-to-apy", label: "Interest rate → APY" },
        { value: "apy-to-apr", label: "APY → interest rate" },
      ],
    },
    { key: "rate", label: "Rate", type: "number", format: "percent", default: 4.5, min: 0, max: 100, step: 0.05, help: "Stated annual interest rate, or the APY when converting back." },
    { key: "frequency", param: "freq", label: "Compounding frequency", type: "select", default: "daily", options: FREQUENCIES },
    { key: "deposit", label: "Deposit (optional)", type: "number", format: "currency", default: 10_000, min: 0, max: 1_000_000_000, step: 500, optional: true, help: "Used to show one year of interest in dollars." },
  ],
  compute: (v) => {
    const frequency = v.frequency as CompoundingFrequency;
    const toApy = v.mode === "apr-to-apy";
    const apr = toApy ? v.rate : apyToApr(v.rate, frequency);
    const apy = toApy ? aprToApy(v.rate, frequency) : v.rate;
    const interest = (v.deposit * apy) / 100;
    const label = FREQUENCIES.find((f) => f.value === frequency)?.label.toLowerCase();

    const comparison = FREQUENCIES.map((f) => ({ frequency: f.label, apy: aprToApy(apr, f.value), interest: (v.deposit * aprToApy(apr, f.value)) / 100 }));

    return {
      primary: toApy
        ? { label: "Annual percentage yield (APY)", value: apy, format: "percent", hint: `${formatPercent(apr)} compounded ${label}` }
        : { label: "Equivalent interest rate", value: apr, format: "percent", hint: `Compounded ${label}` },
      secondary: [
        { label: toApy ? "Interest rate" : "APY", value: toApy ? apr : apy, format: "percent" },
        { label: "Compounding boost", value: apy - apr, format: "percent", hint: "APY minus the stated rate" },
        { label: "Interest in one year", value: interest, format: "currency", tone: "positive" },
        { label: "Balance after one year", value: v.deposit + interest, format: "currency" },
      ],
      tables: [
        {
          id: "frequencies",
          title: `How compounding changes the yield on ${formatPercent(apr)}`,
          views: [
            {
              id: "all",
              label: "All frequencies",
              columns: [
                { key: "frequency", label: "Compounding", align: "left" },
                { key: "apy", label: "APY", format: "percent" },
                { key: "interest", label: "1-year interest", format: "currency" },
              ],
              rows: comparison,
            },
          ],
        },
      ],
      insights: [
        `A ${formatPercent(apr)} rate compounded ${label} earns the same as a ${formatPercent(apy, 3)} rate paid once a year.`,
        `On ${formatCurrency(v.deposit, 0)}, that's ${formatCurrency(interest)} of interest over 12 months if the rate doesn't change.`,
      ],
    };
  },
});
