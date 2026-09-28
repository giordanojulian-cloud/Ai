import type { CalculatorMeta } from "../../types";

export default {
  slug: "cap-rate",
  name: "Cap Rate Calculator",
  shortName: "Cap Rate",
  category: "real-estate",
  secondaryCategories: ["investing"],
  shortDescription: "Calculate a property's capitalization rate from NOI — or its value from a market cap rate.",
  description: "Calculate the capitalization rate of an income property from its value and net operating income, or estimate what a property is worth using a market cap rate.",
  seoTitle: "Cap Rate Calculator — Capitalization Rate & Property Value",
  seoDescription: "Calculate cap rate from property value, rental income, vacancy and operating expenses, or estimate property value from NOI and a market cap rate.",
  keywords: ["cap rate", "capitalization rate", "noi", "net operating income", "commercial real estate", "property value", "real estate investing"],
  searchAliases: ["what is a good cap rate", "calculate property value from noi", "capitalization rate formula"],
  related: ["rental-property", "cash-on-cash-return", "roi", "mortgage"],
  icon: "building",
  popularity: 11,
  addedAt: "2026-09-07",
  disclaimer: "financial",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
