import type { CalculatorMeta } from "../../types";

export default {
  slug: "investment-growth",
  name: "Investment Growth Calculator",
  shortName: "Investment Growth",
  category: "investing",
  shortDescription: "Project a portfolio's growth with contributions, rising deposits, fees and inflation.",
  description:
    "Project how an investment portfolio could grow with regular contributions, then see the impact of fees and inflation on what that money will actually be worth.",
  seoTitle: "Investment Growth Calculator — With Fees & Inflation",
  seoDescription:
    "Estimate how your investments could grow with monthly contributions, rising deposits, fund fees and inflation. See inflation-adjusted value and a yearly table.",
  keywords: ["investment", "investment growth", "portfolio", "retirement", "stock market", "index fund", "fees", "inflation"],
  searchAliases: ["how much will my investments grow", "investment return", "retirement savings growth", "stock market calculator"],
  related: ["compound-interest", "roi", "savings-goal", "apy"],
  icon: "line-chart",
  featured: true,
  popularity: 4,
  addedAt: "2026-09-01",
  disclaimer: "financial",
  affiliate: "brokerage",
  leadGen: "financial-advisor",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
