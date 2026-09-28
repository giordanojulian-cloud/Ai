import type { CalculatorMeta } from "../../types";

export default {
  slug: "compound-interest",
  name: "Compound Interest Calculator",
  shortName: "Compound Interest",
  category: "investing",
  secondaryCategories: ["finance"],
  shortDescription: "See how savings grow with compounding, regular contributions and any compounding frequency.",
  description:
    "Project how an initial deposit and monthly contributions grow with compound interest, with any compounding frequency from annual to continuous.",
  seoTitle: "Compound Interest Calculator with Monthly Contributions",
  seoDescription:
    "Calculate compound interest with monthly contributions and daily, monthly, quarterly or annual compounding. See total interest earned and a year-by-year growth table.",
  keywords: ["compound interest", "interest", "savings growth", "compounding", "future value", "apy", "savings"],
  searchAliases: ["how much will my savings grow", "interest on savings", "future value calculator"],
  related: ["investment-growth", "apy", "savings-goal", "roi"],
  icon: "trending-up",
  featured: true,
  popularity: 2,
  addedAt: "2026-09-01",
  disclaimer: "financial",
  affiliate: "savings",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
