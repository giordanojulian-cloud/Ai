import type { CalculatorMeta } from "../../types";

export default {
  slug: "salary-to-hourly",
  name: "Salary to Hourly Calculator",
  shortName: "Salary to Hourly",
  category: "career",
  secondaryCategories: ["finance"],
  shortDescription: "Convert an annual salary to an hourly wage — or hourly pay to salary — plus every pay period.",
  description: "Convert an annual salary into an hourly rate, or an hourly wage into an annual salary, and see the equivalent daily, weekly, biweekly and monthly pay.",
  seoTitle: "Salary to Hourly Calculator — Convert Pay Both Ways",
  seoDescription: "Convert annual salary to hourly wage (or hourly to salary) using your real hours and weeks worked. See daily, weekly, biweekly, semimonthly and monthly pay.",
  keywords: ["salary", "hourly", "wage", "pay", "salary to hourly", "hourly to salary", "paycheck", "income"],
  searchAliases: ["how much is my salary per hour", "hourly wage to annual salary", "what is 60000 a year hourly"],
  related: ["employee-cost", "savings-goal", "debt-payoff", "percentage"],
  icon: "clock",
  popularity: 7,
  addedAt: "2026-09-04",
  disclaimer: "estimate",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
