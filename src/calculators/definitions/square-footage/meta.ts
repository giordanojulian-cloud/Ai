import type { CalculatorMeta } from "../../types";

export default {
  slug: "square-footage",
  name: "Square Footage Calculator",
  shortName: "Square Footage",
  category: "construction",
  secondaryCategories: ["everyday"],
  shortDescription: "Add up the square footage of rooms or areas and estimate flooring or material costs.",
  description: "Calculate the square footage of one or more rectangular areas, add a waste allowance, and estimate material costs for flooring, tile, sod or paint prep.",
  seoTitle: "Square Footage Calculator — Area, Waste & Material Cost",
  seoDescription: "Calculate square feet for multiple rooms or areas, convert to square meters and yards, add waste for flooring or tile, and estimate total material cost.",
  keywords: ["square footage", "square feet", "area", "flooring", "sq ft", "room size", "tile", "carpet"],
  searchAliases: ["how many square feet", "flooring calculator", "room area calculator", "sq ft calculator"],
  related: ["concrete", "percentage", "closing-cost", "mortgage"],
  icon: "ruler",
  popularity: 19,
  addedAt: "2026-09-11",
  disclaimer: "estimate",
  leadGen: "contractor",
  schema: { applicationCategory: "UtilitiesApplication" },
} satisfies CalculatorMeta;
