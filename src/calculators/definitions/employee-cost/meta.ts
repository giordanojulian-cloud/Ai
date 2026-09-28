import type { CalculatorMeta } from "../../types";

export default {
  slug: "employee-cost",
  name: "Employee Cost Calculator",
  shortName: "Employee Cost",
  category: "business",
  secondaryCategories: ["career"],
  shortDescription: "Estimate the fully loaded cost of an employee: payroll taxes, benefits and overhead.",
  description: "Estimate what an employee really costs — salary plus employer payroll taxes, benefits, workers' compensation and overhead — per year, per month and per productive hour.",
  seoTitle: "Employee Cost Calculator — True Cost of an Employee",
  seoDescription: "Calculate the fully loaded cost of hiring an employee: Social Security, Medicare, FUTA, SUTA, health insurance, 401(k) match, workers' comp and overhead.",
  keywords: ["employee cost", "cost of employee", "fully loaded cost", "payroll taxes", "employer taxes", "hiring", "labor cost", "burden rate"],
  searchAliases: ["how much does an employee cost", "true cost of hiring", "employer payroll tax calculator", "labor burden"],
  related: ["salary-to-hourly", "profit-margin", "break-even", "saas-valuation"],
  icon: "users",
  popularity: 16,
  addedAt: "2026-09-09",
  disclaimer: "financial",
  affiliate: "payroll",
  schema: { applicationCategory: "BusinessApplication" },
} satisfies CalculatorMeta;
