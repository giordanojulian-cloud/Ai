import type { CalculatorMeta } from "../../types";

export default {
  slug: "debt-payoff",
  name: "Debt Payoff Calculator",
  shortName: "Debt Payoff",
  category: "debt",
  secondaryCategories: ["finance"],
  shortDescription: "Plan payoff for multiple debts with the avalanche or snowball method and see your debt-free date.",
  description:
    "Enter up to four debts to see when you'll be debt-free, how much interest you'll pay, and how the avalanche and snowball methods compare.",
  seoTitle: "Debt Payoff Calculator — Avalanche vs. Snowball",
  seoDescription:
    "Find your debt-free date for multiple debts. Compare the avalanche and snowball methods, see total interest, payoff order and how extra payments speed things up.",
  keywords: ["debt payoff", "debt", "avalanche", "snowball", "debt free", "loan payoff", "pay off debt", "extra payment"],
  searchAliases: ["how long to pay off debt", "debt snowball calculator", "debt avalanche calculator", "when will i be debt free"],
  related: ["credit-card-payoff", "savings-goal", "compound-interest", "salary-to-hourly"],
  icon: "scale",
  featured: true,
  popularity: 5,
  addedAt: "2026-09-02",
  disclaimer: "financial",
  affiliate: "debt",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
