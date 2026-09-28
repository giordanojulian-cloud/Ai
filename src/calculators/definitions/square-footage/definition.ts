import { formatCurrency, formatNumber } from "@/lib/format";
import { defineCalculator, type FieldDefinition } from "../../types";
import { SQ_FT_TO_SQ_M, totalArea } from "./logic";

type Values = Record<string, number> & { waste: number; price: number };
const AREAS = [1, 2, 3, 4] as const;
const DEFAULTS: Record<number, [number, number]> = { 1: [12, 14], 2: [10, 12], 3: [0, 0], 4: [0, 0] };

export default defineCalculator<Values>({
  slug: "square-footage",
  groups: [
    ...AREAS.map((n) => ({ id: `a${n}`, label: `Area ${n}${n > 2 ? " (optional)" : ""}`, collapsible: n > 2 })),
    { id: "order", label: "Materials" },
  ],
  fields: [
    ...AREAS.flatMap((n): FieldDefinition<string>[] => [
      { key: `l${n}`, label: "Length", type: "number", format: "number", default: DEFAULTS[n]![0], min: 0, max: 100_000, step: 0.5, suffix: "ft", group: `a${n}`, optional: true },
      { key: `w${n}`, label: "Width", type: "number", format: "number", default: DEFAULTS[n]![1], min: 0, max: 100_000, step: 0.5, suffix: "ft", group: `a${n}`, optional: true },
    ]),
    { key: "waste", label: "Waste / overage", type: "number", format: "percent", default: 10, min: 0, max: 50, step: 1, group: "order", optional: true, help: "Add 10% for straight layouts, 15%+ for diagonal patterns." },
    { key: "price", label: "Price per sq ft (optional)", type: "number", format: "currency", default: 0, min: 0, max: 10_000, step: 0.25, group: "order", optional: true },
  ],
  validate: (v) => (AREAS.every((n) => v[`l${n}`]! * v[`w${n}`]! === 0) ? { l1: "Enter the length and width of at least one area." } : {}),
  compute: (v) => {
    const dims = AREAS.map((n) => [v[`l${n}`]!, v[`w${n}`]!] as [number, number]);
    const area = totalArea(dims);
    const withWaste = area * (1 + v.waste / 100);
    const cost = withWaste * v.price;
    return {
      primary: { label: "Total area", value: area, format: "number", hint: "square feet" },
      secondary: [
        { label: "With waste (sq ft)", value: withWaste, format: "number", hint: `+${formatNumber(v.waste, 0)}%` },
        { label: "Square meters", value: area * SQ_FT_TO_SQ_M, format: "number" },
        { label: "Square yards", value: area / 9, format: "number" },
        ...(v.price > 0 ? [{ label: "Material cost", value: cost, format: "currency" as const, hint: "including waste" }] : []),
      ],
      tables: [
        {
          id: "areas",
          title: "Areas",
          views: [
            {
              id: "all",
              label: "All areas",
              columns: [
                { key: "area", label: "Area", align: "left" },
                { key: "size", label: "Dimensions", align: "right" },
                { key: "sqft", label: "Square feet", format: "number" },
              ],
              rows: dims
                .map(([l, w], i) => ({ area: `Area ${i + 1}`, size: `${formatNumber(l)} × ${formatNumber(w)} ft`, sqft: l * w }))
                .filter((row) => row.sqft > 0),
              footer: { area: "Total", size: "", sqft: area },
            },
          ],
        },
      ],
      insights: [
        `Order about ${formatNumber(Math.ceil(withWaste), 0)} square feet of material to cover ${formatNumber(area, 2)} square feet with a ${formatNumber(v.waste, 0)}% allowance.`,
        ...(v.price > 0 ? [`At ${formatCurrency(v.price)} per square foot, materials cost about ${formatCurrency(cost, 0)}.`] : []),
      ],
    };
  },
});
