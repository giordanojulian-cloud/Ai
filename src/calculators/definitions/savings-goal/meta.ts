import type { CalculatorMeta } from "../../types";

export default {
  slug: "savings-goal",
  name: "Savings Goal Calculator",
  shortName: "Savings Goal",
  category: "finance",
  secondaryCategories: ["investing"],
  shortDescription: "Find how much to save each month to reach a goal by a specific date.",
  description: "Work out how much you need to save each month to hit a savings goal by your target date, including the interest your savings earn along the way.",
  seoTitle: "Savings Goal Calculator — How Much to Save Per Month",
  seoDescription:
    "Calculate the monthly savings needed to reach your goal by a target date. Includes interest (APY) on your savings, current balance and a year-by-year plan.",
  keywords: ["savings goal", "savings", "monthly savings", "emergency fund", "save money", "down payment savings", "sinking fund"],
  searchAliases: ["how much should i save each month", "how much to save per month", "save for a house"],
  related: ["compound-interest", "apy", "investment-growth", "debt-payoff"],
  icon: "piggy-bank",
  popularity: 9,
  addedAt: "2026-09-03",
  disclaimer: "financial",
  affiliate: "savings",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
