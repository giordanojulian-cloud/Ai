import type { CalculatorMeta } from "../../types";

export default {
  slug: "saas-valuation",
  name: "SaaS Valuation Calculator",
  shortName: "SaaS Valuation",
  category: "business",
  secondaryCategories: ["investing"],
  shortDescription: "Estimate a SaaS company's value from ARR and profit multiples with conservative, base and aggressive scenarios.",
  description: "Estimate what a SaaS business could be worth using ARR and profit multiples, with conservative, base and aggressive scenarios plus the metrics buyers look at.",
  seoTitle: "SaaS Valuation Calculator — ARR & Profit Multiples",
  seoDescription: "Estimate a SaaS company valuation from MRR, growth, margins, churn and ARR or profit multiples. See conservative, base and aggressive scenarios and the Rule of 40.",
  keywords: ["saas valuation", "saas", "arr multiple", "startup valuation", "business valuation", "mrr", "rule of 40", "churn", "software company value"],
  searchAliases: ["how much is my saas worth", "saas company valuation", "value my software business"],
  related: ["profit-margin", "roi", "break-even", "employee-cost"],
  icon: "briefcase",
  popularity: 17,
  addedAt: "2026-09-10",
  disclaimer: "financial",
  schema: { applicationCategory: "BusinessApplication" },
} satisfies CalculatorMeta;
