import type { CalculatorMeta } from "../../types";

export default {
  slug: "mortgage-affordability",
  name: "Mortgage Affordability Calculator",
  shortName: "Home Affordability",
  category: "real-estate",
  secondaryCategories: ["finance"],
  shortDescription: "Estimate how much house you can afford based on income, debts and down payment.",
  description: "Estimate the most you can spend on a home based on your income, existing debts, down payment and the debt-to-income limits lenders commonly use.",
  seoTitle: "How Much House Can I Afford? Mortgage Affordability Calculator",
  seoDescription:
    "Find out how much house you can afford using your income, monthly debts, down payment, rate, taxes and insurance. Compare conservative, standard and stretch budgets.",
  keywords: ["affordability", "how much house can i afford", "afford", "home budget", "debt to income", "dti", "mortgage", "home price"],
  searchAliases: ["how much house can i afford", "how much mortgage can i afford", "home affordability", "house budget"],
  related: ["mortgage", "fha-mortgage", "closing-cost", "savings-goal"],
  icon: "key",
  featured: true,
  popularity: 3,
  addedAt: "2026-09-05",
  disclaimer: "financial",
  affiliate: "mortgage",
  leadGen: "real-estate-agent",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
