import type { CalculatorMeta } from "../../types";

export default {
  slug: "roi",
  name: "ROI Calculator",
  shortName: "ROI",
  category: "investing",
  secondaryCategories: ["business"],
  shortDescription: "Calculate return on investment and annualized ROI, including income and costs.",
  description: "Calculate the return on any investment — total ROI, net gain and annualized return — including income received and fees paid along the way.",
  seoTitle: "ROI Calculator — Return on Investment & Annualized ROI",
  seoDescription: "Calculate return on investment (ROI), net profit and annualized ROI (CAGR). Include dividends, rental income, fees and holding period for an accurate comparison.",
  keywords: ["roi", "return on investment", "investment return", "annualized return", "cagr", "profit", "gain"],
  searchAliases: ["investment return", "what is my return", "annualized return calculator", "cagr calculator"],
  related: ["investment-growth", "compound-interest", "cash-on-cash-return", "profit-margin"],
  icon: "percent",
  featured: true,
  popularity: 6,
  addedAt: "2026-09-03",
  disclaimer: "financial",
  affiliate: "brokerage",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
