/**
 * Plans and entitlements. Stripe price IDs come from the environment so test
 * and live modes can differ; display prices here must match Stripe.
 */
export type Feature =
  | "save_calculations"
  | "unlimited_saves"
  | "csv_export"
  | "pdf_export"
  | "advanced_scenarios"
  | "historical_comparisons"
  | "advanced_charts"
  | "ai_explanations"
  | "no_ads"
  | "premium_calculators";

export type PlanId = "free" | "pro_monthly" | "pro_annual";

export interface Plan {
  id: PlanId;
  name: string;
  priceLabel: string;
  interval?: "month" | "year";
  description: string;
  highlights: string[];
  /** Env var holding the Stripe price ID. */
  stripePriceEnv?: string;
}

export const FREE_SAVED_CALCULATION_LIMIT = 10;

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceLabel: "$0",
    description: "Every calculator, formulas and explanations. No account required.",
    highlights: ["All standard calculators", "Charts, schedules and CSV export", "Shareable result links", `Save up to ${FREE_SAVED_CALCULATION_LIMIT} calculations`],
  },
  pro_monthly: {
    id: "pro_monthly",
    name: "Pro",
    priceLabel: "$9",
    interval: "month",
    description: "For people who use calculators to make real decisions.",
    highlights: ["Unlimited saved calculations", "Advanced scenarios & comparisons", "PDF reports", "AI explanations", "No ads"],
    stripePriceEnv: "STRIPE_PRICE_PRO_MONTHLY",
  },
  pro_annual: {
    id: "pro_annual",
    name: "Pro Annual",
    priceLabel: "$79",
    interval: "year",
    description: "Everything in Pro, billed yearly — two months free.",
    highlights: ["Everything in Pro", "Priority support"],
    stripePriceEnv: "STRIPE_PRICE_PRO_ANNUAL",
  },
};

/**
 * CSV export is intentionally free during launch to maximize usefulness;
 * move it to PRO_FEATURES to gate it.
 */
export const FREE_FEATURES: Feature[] = ["save_calculations", "csv_export"];
export const PRO_FEATURES: Feature[] = [
  ...FREE_FEATURES,
  "unlimited_saves",
  "pdf_export",
  "advanced_scenarios",
  "historical_comparisons",
  "advanced_charts",
  "ai_explanations",
  "no_ads",
  "premium_calculators",
];

export function priceIdForPlan(plan: PlanId): string | undefined {
  const env = PLANS[plan].stripePriceEnv;
  return env ? process.env[env] : undefined;
}

export function planForPriceId(priceId: string | null | undefined): PlanId | undefined {
  return (["pro_monthly", "pro_annual"] as const).find((plan) => priceId && priceIdForPlan(plan) === priceId);
}
