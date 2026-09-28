import type { CalculatorMeta } from "../../types";

export default {
  slug: "closing-cost",
  name: "Closing Cost Calculator",
  shortName: "Closing Costs",
  category: "real-estate",
  shortDescription: "Itemize buyer closing costs and see the total cash you need at closing.",
  description: "Estimate the closing costs on a home purchase — lender fees, title and government charges, inspections, prepaids and escrow — and the total cash you'll need at closing.",
  seoTitle: "Closing Cost Calculator for Home Buyers (Itemized)",
  seoDescription:
    "Estimate buyer closing costs item by item: origination, points, appraisal, title insurance, transfer taxes, prepaid interest and escrow. See total cash needed to close.",
  keywords: ["closing costs", "closing cost", "cash to close", "title insurance", "origination fee", "escrow", "prepaids", "home buying"],
  searchAliases: ["how much are closing costs", "cash needed to buy a house", "buyer closing costs"],
  related: ["mortgage", "mortgage-affordability", "fha-mortgage", "savings-goal"],
  icon: "receipt",
  popularity: 13,
  addedAt: "2026-09-06",
  disclaimer: "financial",
  affiliate: "mortgage",
  leadGen: "real-estate-agent",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
