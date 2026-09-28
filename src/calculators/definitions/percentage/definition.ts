import { formatNumber } from "@/lib/format";
import { defineCalculator } from "../../types";
import { percentage, type PercentageMode } from "./logic";

type Values = { mode: string; a: number; b: number };

const LABELS: Record<PercentageMode, { a: string; b: string; result: string }> = {
  of: { a: "Percentage (X)", b: "Of number (Y)", result: "X% of Y" },
  "is-what-percent": { a: "Number (X)", b: "Total (Y)", result: "X as a percent of Y" },
  change: { a: "From (original value)", b: "To (new value)", result: "Percentage change" },
  adjust: { a: "Change by (%)", b: "Starting number", result: "Result" },
};

export default defineCalculator<Values>({
  slug: "percentage",
  fields: [
    {
      key: "mode",
      label: "Calculation",
      type: "select",
      default: "of",
      fullWidth: true,
      options: [
        { value: "of", label: "What is X% of Y?" },
        { value: "is-what-percent", label: "X is what percent of Y?" },
        { value: "change", label: "Percentage change from X to Y" },
        { value: "adjust", label: "Increase or decrease Y by X%" },
      ],
    },
    { key: "a", label: "X", type: "number", format: "number", default: 15, min: -1e12, max: 1e12, step: 1, help: "Percentage, part or starting value depending on the calculation." },
    { key: "b", label: "Y", type: "number", format: "number", default: 200, min: -1e12, max: 1e12, step: 1 },
  ],
  validate: (v) => {
    if (v.mode === "is-what-percent" && v.b === 0) return { b: "The total can't be zero." };
    if (v.mode === "change" && v.a === 0) return { a: "Percentage change from zero is undefined." };
    return {};
  },
  compute: (v) => {
    const mode = v.mode as PercentageMode;
    const r = percentage(mode, v.a, v.b)!;
    const labels = LABELS[mode];
    const text = (() => {
      switch (mode) {
        case "of":
          return `${formatNumber(v.a, 4)}% of ${formatNumber(v.b, 4)} is ${formatNumber(r.value, 4)}.`;
        case "is-what-percent":
          return `${formatNumber(v.a, 4)} is ${formatNumber(r.value, 4)}% of ${formatNumber(v.b, 4)}.`;
        case "change":
          return `Going from ${formatNumber(v.a, 4)} to ${formatNumber(v.b, 4)} is a ${formatNumber(Math.abs(r.value), 4)}% ${r.value >= 0 ? "increase" : "decrease"}.`;
        case "adjust":
          return `${formatNumber(v.b, 4)} ${v.a >= 0 ? "increased" : "decreased"} by ${formatNumber(Math.abs(v.a), 4)}% is ${formatNumber(r.value, 4)}.`;
      }
    })();
    return {
      primary: { label: labels.result, value: r.value, format: r.isPercent ? "percent" : "number", hint: `${labels.a.split(" (")[0]}: ${formatNumber(v.a, 4)} · ${labels.b.split(" (")[0]}: ${formatNumber(v.b, 4)}` },
      secondary: [],
      insights: [text, `Working: ${r.expression} = ${formatNumber(r.value, 6)}`],
    };
  },
});
