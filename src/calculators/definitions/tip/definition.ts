import { formatCurrency, formatPercent } from "@/lib/format";
import { defineCalculator } from "../../types";
import { calculateTip } from "./logic";

type Values = { subtotal: number; tax: number; tip: number; people: number; round: boolean };

export default defineCalculator<Values>({
  slug: "tip",
  fields: [
    { key: "subtotal", label: "Bill before tax", type: "number", format: "currency", default: 85, min: 0.01, max: 1_000_000, step: 1 },
    { key: "tax", label: "Tax", type: "number", format: "currency", default: 7.23, min: 0, max: 1_000_000, step: 0.5, optional: true },
    { key: "tip", label: "Tip", type: "number", format: "percent", default: 18, min: 0, max: 100, step: 1 },
    { key: "people", label: "Split between", type: "number", format: "integer", default: 2, min: 1, max: 100, step: 1, suffix: "people" },
    { key: "round", label: "Round each share up to the nearest dollar", type: "toggle", default: false },
  ],
  compute: (v) => {
    const r = calculateTip({ subtotal: v.subtotal, tax: v.tax, tipPercent: v.tip, people: v.people, roundUp: v.round });
    const effective = (r.tip / v.subtotal) * 100;
    const options = [15, 18, 20, 22, 25].map((pct) => {
      const option = calculateTip({ subtotal: v.subtotal, tax: v.tax, tipPercent: pct, people: v.people, roundUp: false });
      return { percent: pct, tip: option.tip, total: option.total, perPerson: option.perPerson };
    });
    return {
      primary: v.people > 1
        ? { label: "Each person pays", value: r.perPerson, format: "currency", hint: `${formatCurrency(r.total)} total` }
        : { label: "Total to pay", value: r.total, format: "currency", hint: `Including ${formatCurrency(r.tip)} tip` },
      secondary: [
        { label: "Tip amount", value: r.tip, format: "currency", hint: v.round ? `${formatPercent(effective, 1)} after rounding` : undefined },
        { label: "Total with tip", value: r.total, format: "currency" },
        ...(v.people > 1 ? [{ label: "Tip per person", value: r.tipPerPerson, format: "currency" as const }] : []),
      ],
      tables: [
        {
          id: "options",
          title: "Common tip amounts",
          views: [
            {
              id: "all",
              label: "Tip options",
              columns: [
                { key: "percent", label: "Tip", format: "percent" },
                { key: "tip", label: "Tip amount", format: "currency" },
                { key: "total", label: "Total", format: "currency" },
                { key: "perPerson", label: "Per person", format: "currency" },
              ],
              rows: options,
            },
          ],
        },
      ],
      insights: [`The tip is calculated on the pre-tax amount of ${formatCurrency(v.subtotal)}, which is the common convention in the U.S.`],
    };
  },
});
