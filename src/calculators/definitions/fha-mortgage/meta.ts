import type { CalculatorMeta } from "../../types";

export default {
  slug: "fha-mortgage",
  name: "FHA Mortgage Calculator",
  shortName: "FHA Mortgage",
  category: "real-estate",
  shortDescription: "Estimate an FHA loan payment with upfront and annual mortgage insurance premiums.",
  description:
    "Estimate your monthly FHA loan payment, including the upfront mortgage insurance premium, annual MIP from the current HUD table, taxes and insurance.",
  seoTitle: "FHA Mortgage Calculator with MIP (Upfront & Annual)",
  seoDescription:
    "Calculate an FHA mortgage payment including upfront MIP, annual MIP, taxes, insurance and HOA. Uses the current HUD MIP table with editable assumptions.",
  keywords: ["fha", "fha loan", "fha mortgage", "mip", "mortgage insurance premium", "first time home buyer", "3.5% down", "mortgage"],
  searchAliases: ["fha loan payment", "fha mortgage insurance", "low down payment mortgage"],
  related: ["mortgage", "mortgage-affordability", "closing-cost", "savings-goal"],
  icon: "landmark",
  popularity: 10,
  addedAt: "2026-09-05",
  disclaimer: "financial",
  affiliate: "mortgage",
  leadGen: "mortgage",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
