import type { CalculatorMeta } from "../../types";

export default {
  slug: "concrete",
  name: "Concrete Calculator",
  shortName: "Concrete",
  category: "construction",
  shortDescription: "Estimate cubic yards and bags of concrete for slabs, footings and round columns.",
  description: "Estimate how much concrete you need for a slab, footing, wall or round column — in cubic yards, cubic feet and 80, 60 or 40 lb bags — with a waste allowance.",
  seoTitle: "Concrete Calculator — Cubic Yards & Bags Needed",
  seoDescription: "Calculate concrete for slabs, footings and columns in cubic yards, cubic feet, cubic meters and 80/60/40 lb bags, with waste allowance and optional cost.",
  keywords: ["concrete", "cement", "cubic yards", "concrete slab", "bags of concrete", "footing", "patio", "sonotube"],
  searchAliases: ["how much concrete do i need", "how many bags of concrete", "concrete yardage"],
  related: ["square-footage", "percentage", "tip", "closing-cost"],
  icon: "hard-hat",
  popularity: 18,
  addedAt: "2026-09-11",
  disclaimer: "estimate",
  leadGen: "contractor",
  schema: { applicationCategory: "UtilitiesApplication" },
} satisfies CalculatorMeta;
