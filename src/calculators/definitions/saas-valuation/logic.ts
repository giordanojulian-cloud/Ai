export interface SaasInput {
  mrr: number;
  growthPercent: number; // annual revenue growth
  grossMarginPercent: number;
  netMarginPercent: number;
  monthlyChurnPercent: number;
  revenueMultiple: number; // × ARR
  profitMultiple: number; // × annual net profit
  /** Scenario spread applied to both multiples (e.g. 25 → ×0.75 and ×1.25). */
  scenarioSpreadPercent: number;
}

export interface SaasScenario {
  id: "conservative" | "base" | "aggressive";
  label: string;
  revenueMultiple: number;
  profitMultiple: number;
  revenueValuation: number;
  profitValuation: number;
}

export interface SaasResult {
  arr: number;
  forwardArr: number;
  grossProfit: number;
  annualProfit: number;
  revenueValuation: number;
  profitValuation: number;
  annualChurnPercent: number;
  customerLifetimeMonths: number;
  ruleOf40: number;
  scenarios: SaasScenario[];
}

export function valueSaas(i: SaasInput): SaasResult {
  const arr = i.mrr * 12;
  const annualProfit = (arr * i.netMarginPercent) / 100;
  const spread = i.scenarioSpreadPercent / 100;
  const scenario = (id: SaasScenario["id"], label: string, factor: number): SaasScenario => ({
    id,
    label,
    revenueMultiple: i.revenueMultiple * factor,
    profitMultiple: i.profitMultiple * factor,
    revenueValuation: arr * i.revenueMultiple * factor,
    profitValuation: Math.max(0, annualProfit) * i.profitMultiple * factor,
  });
  const churn = i.monthlyChurnPercent / 100;
  return {
    arr,
    forwardArr: arr * (1 + i.growthPercent / 100),
    grossProfit: (arr * i.grossMarginPercent) / 100,
    annualProfit,
    revenueValuation: arr * i.revenueMultiple,
    profitValuation: Math.max(0, annualProfit) * i.profitMultiple,
    annualChurnPercent: (1 - (1 - churn) ** 12) * 100,
    customerLifetimeMonths: churn > 0 ? 1 / churn : Infinity,
    ruleOf40: i.growthPercent + i.netMarginPercent,
    scenarios: [
      scenario("conservative", "Conservative", 1 - spread),
      scenario("base", "Base", 1),
      scenario("aggressive", "Aggressive", 1 + spread),
    ],
  };
}
