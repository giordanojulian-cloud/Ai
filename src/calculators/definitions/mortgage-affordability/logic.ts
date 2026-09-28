import { loanPayment } from "@/lib/finance";

export interface AffordabilityInput {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  ratePercent: number;
  termYears: number;
  propertyTaxPercent: number; // annual, % of price
  insuranceAnnual: number;
  hoaMonthly: number;
  pmiRatePercent: number; // annual, % of loan when LTV > 80%
  frontEndRatio: number; // percent of gross monthly income for housing
  backEndRatio: number; // percent of gross monthly income for housing + debts
}

export interface PaymentBreakdown {
  principalAndInterest: number;
  tax: number;
  insurance: number;
  hoa: number;
  pmi: number;
  total: number;
}

export interface AffordabilityResult {
  maxPrice: number;
  loanAmount: number;
  payment: PaymentBreakdown;
  maxHousingPayment: number;
  limitingRatio: "front-end" | "back-end";
  affordable: boolean;
}

export function housingPayment(price: number, input: AffordabilityInput): PaymentBreakdown {
  const loan = Math.max(0, price - input.downPayment);
  const principalAndInterest = loanPayment(loan, input.ratePercent, input.termYears * 12);
  const tax = (price * input.propertyTaxPercent) / 100 / 12;
  const insurance = input.insuranceAnnual / 12;
  const pmi = price > 0 && loan / price > 0.8 ? (loan * input.pmiRatePercent) / 100 / 12 : 0;
  return { principalAndInterest, tax, insurance, hoa: input.hoaMonthly, pmi, total: principalAndInterest + tax + insurance + input.hoaMonthly + pmi };
}

/**
 * Maximum housing payment under the two debt-to-income limits:
 *   front-end: housing ≤ income × front ratio
 *   back-end:  housing + other debts ≤ income × back ratio
 * Then finds the highest price whose full payment fits, by bisection (the
 * payment rises monotonically with price, including the PMI step at 80% LTV).
 */
export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const monthlyIncome = input.annualIncome / 12;
  const frontLimit = (monthlyIncome * input.frontEndRatio) / 100;
  const backLimit = (monthlyIncome * input.backEndRatio) / 100 - input.monthlyDebts;
  const maxHousingPayment = Math.min(frontLimit, backLimit);
  const limitingRatio = backLimit < frontLimit ? "back-end" : "front-end";

  if (housingPayment(0, input).total > maxHousingPayment) {
    return { maxPrice: 0, loanAmount: 0, payment: housingPayment(0, input), maxHousingPayment: Math.max(0, maxHousingPayment), limitingRatio, affordable: false };
  }

  let low = 0;
  let high = 1_000_000;
  while (housingPayment(high, input).total <= maxHousingPayment && high < 1e9) high *= 2;
  for (let i = 0; i < 100 && high - low > 0.01; i++) {
    const mid = (low + high) / 2;
    if (housingPayment(mid, input).total <= maxHousingPayment) low = mid;
    else high = mid;
  }
  const maxPrice = Math.floor(low);
  return {
    maxPrice,
    loanAmount: Math.max(0, maxPrice - input.downPayment),
    payment: housingPayment(maxPrice, input),
    maxHousingPayment,
    limitingRatio,
    affordable: true,
  };
}

/** Common rule-of-thumb DTI presets. These are guidelines, not lending rules. */
export const DTI_SCENARIOS = [
  { id: "conservative", label: "Conservative", front: 25, back: 33 },
  { id: "standard", label: "Standard (28/36)", front: 28, back: 36 },
  { id: "stretch", label: "Stretch", front: 31, back: 43 },
] as const;
