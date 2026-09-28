import type { CalculatorMeta } from "../../types";

export default {
  slug: "mortgage",
  name: "Mortgage Calculator",
  shortName: "Mortgage",
  category: "real-estate",
  secondaryCategories: ["finance"],
  shortDescription: "Estimate your full monthly payment with taxes, insurance, PMI and HOA, plus a complete amortization schedule.",
  description:
    "Estimate your total monthly mortgage payment — principal, interest, property tax, homeowners insurance, PMI and HOA dues — and see exactly how the loan is paid down over time.",
  seoTitle: "Mortgage Calculator with Taxes, PMI & Amortization Schedule",
  seoDescription:
    "Calculate your monthly mortgage payment including property tax, insurance, PMI and HOA. See total interest, total cost and a monthly or annual amortization schedule.",
  keywords: ["mortgage", "mortgage payment", "home loan", "amortization", "piti", "pmi", "house payment", "monthly payment"],
  searchAliases: ["how much is my mortgage payment", "monthly house payment", "home loan calculator", "amortization schedule"],
  related: ["mortgage-affordability", "fha-mortgage", "closing-cost", "rental-property"],
  icon: "home",
  featured: true,
  popularity: 1,
  addedAt: "2026-09-01",
  disclaimer: "financial",
  affiliate: "mortgage",
  leadGen: "mortgage",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
