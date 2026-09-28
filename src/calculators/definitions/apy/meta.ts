import type { CalculatorMeta } from "../../types";

export default {
  slug: "apy",
  name: "APY Calculator",
  shortName: "APY",
  category: "finance",
  secondaryCategories: ["investing"],
  shortDescription: "Convert an interest rate to APY (and back) for any compounding frequency.",
  description: "Convert a stated interest rate into its annual percentage yield (APY) — or an APY back into the underlying rate — and see how compounding frequency changes what you earn.",
  seoTitle: "APY Calculator — Convert Interest Rate to APY",
  seoDescription: "Calculate annual percentage yield (APY) from an interest rate and compounding frequency, or convert APY back to APR. Compare daily, monthly and annual compounding.",
  keywords: ["apy", "annual percentage yield", "apr to apy", "interest rate", "compounding", "savings rate", "yield"],
  searchAliases: ["apr vs apy", "convert apr to apy", "effective annual rate calculator"],
  related: ["compound-interest", "savings-goal", "investment-growth", "credit-card-payoff"],
  icon: "landmark",
  popularity: 12,
  addedAt: "2026-09-04",
  disclaimer: "financial",
  affiliate: "savings",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
