import { formatCurrency, formatNumber } from "@/lib/format";
import { defineCalculator } from "../../types";
import { calculateConcrete, type ConcreteShape } from "./logic";

type Values = { shape: string; length: number; width: number; thickness: number; diameter: number; height: number; quantity: number; waste: number; price: number };

const isSlab = (v: Record<string, unknown>) => v.shape === "slab";

export default defineCalculator<Values>({
  slug: "concrete",
  fields: [
    {
      key: "shape",
      label: "Pour type",
      type: "select",
      display: "segmented",
      default: "slab",
      fullWidth: true,
      options: [
        { value: "slab", label: "Slab, footing or wall" },
        { value: "column", label: "Round column" },
      ],
    },
    { key: "length", label: "Length", type: "number", format: "number", default: 10, min: 0.1, max: 10_000, step: 0.5, suffix: "ft", visibleWhen: isSlab },
    { key: "width", label: "Width", type: "number", format: "number", default: 10, min: 0.1, max: 10_000, step: 0.5, suffix: "ft", visibleWhen: isSlab },
    { key: "thickness", label: "Thickness", type: "number", format: "number", default: 4, min: 0.5, max: 120, step: 0.5, suffix: "in", visibleWhen: isSlab },
    { key: "diameter", label: "Diameter", type: "number", format: "number", default: 12, min: 1, max: 240, step: 1, suffix: "in", visibleWhen: (v) => !isSlab(v) },
    { key: "height", label: "Height", type: "number", format: "number", default: 4, min: 0.1, max: 200, step: 0.5, suffix: "ft", visibleWhen: (v) => !isSlab(v) },
    { key: "quantity", label: "Quantity", type: "number", format: "integer", default: 1, min: 1, max: 10_000, step: 1 },
    { key: "waste", label: "Waste allowance", type: "number", format: "percent", default: 10, min: 0, max: 50, step: 1, optional: true, help: "5–10% is typical for spillage and uneven subgrade." },
    { key: "price", label: "Ready-mix price per cubic yard (optional)", type: "number", format: "currency", default: 0, min: 0, max: 10_000, step: 5, optional: true },
  ],
  compute: (v) => {
    const r = calculateConcrete({
      shape: v.shape as ConcreteShape,
      lengthFt: v.length,
      widthFt: v.width,
      thicknessIn: v.thickness,
      diameterIn: v.diameter,
      heightFt: v.height,
      quantity: v.quantity,
      wastePercent: v.waste,
    });
    const cost = r.cubicYards * v.price;
    return {
      primary: { label: "Concrete needed", value: r.cubicYards, format: "number", hint: `cubic yards, including ${formatNumber(v.waste, 0)}% waste` },
      secondary: [
        { label: "Cubic feet", value: r.cubicFeetWithWaste, format: "number" },
        { label: "Cubic meters", value: r.cubicMeters, format: "number" },
        { label: "80 lb bags", value: r.bags[80], format: "integer" },
        { label: "60 lb bags", value: r.bags[60], format: "integer" },
        { label: "40 lb bags", value: r.bags[40], format: "integer" },
        ...(v.price > 0 ? [{ label: "Ready-mix cost", value: cost, format: "currency" as const }] : []),
      ],
      insights: [
        `The pour itself is ${formatNumber(r.cubicFeet, 2)} cubic feet; with waste you should order about ${formatNumber(r.cubicYards, 2)} cubic yards.`,
        r.cubicYards >= 1
          ? "At a cubic yard or more, ready-mix delivery is usually cheaper and easier than mixing bags. Many suppliers have a minimum order or short-load fee."
          : "For small pours under about a cubic yard, pre-mixed bags are usually the practical choice.",
        ...(v.price > 0 ? [`At ${formatCurrency(v.price, 0)} per yard, the concrete costs about ${formatCurrency(cost, 0)} before delivery fees.`] : []),
      ],
    };
  },
});
