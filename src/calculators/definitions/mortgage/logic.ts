import { buildHousingSchedule, type HousingSchedule } from "../../shared/housing";

export interface MortgageInput {
  homePrice: number;
  downPayment: number; // dollars
  ratePercent: number;
  termYears: number;
  propertyTaxAnnual: number; // dollars
  insuranceAnnual: number;
  hoaMonthly: number;
  /** Annual PMI premium as a percent of the original loan amount. */
  pmiRatePercent: number;
  extraMonthly: number;
}

/**
 * Loan-to-value at which borrower-paid PMI automatically terminates under the
 * Homeowners Protection Act (78% of original value). Lenders must also cancel
 * at 80% on request; we model the automatic threshold.
 */
export const PMI_AUTO_CANCEL_LTV = 0.78;
/** Conventional loans generally require PMI above 80% LTV. */
export const PMI_REQUIRED_ABOVE_LTV = 0.8;

export interface MortgageResult {
  loanAmount: number;
  downPaymentPercent: number;
  ltv: number;
  pmiApplies: boolean;
  monthlyPrincipalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
  totalMonthlyPayment: number;
  schedule: HousingSchedule;
  totalInterest: number;
  totalPmi: number;
  /** Down payment + every payment over the life of the loan (P&I, extra, taxes, insurance, PMI, HOA). */
  totalCost: number;
  payoffMonths: number;
  /** Month in which the last PMI premium is paid (0 if none). */
  pmiLastMonth: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const loanAmount = Math.max(0, input.homePrice - input.downPayment);
  const ltv = input.homePrice > 0 ? loanAmount / input.homePrice : 0;
  const pmiApplies = ltv > PMI_REQUIRED_ABOVE_LTV && input.pmiRatePercent > 0;
  const monthlyPmi = pmiApplies ? (loanAmount * input.pmiRatePercent) / 100 / 12 : 0;
  const cancelBalance = input.homePrice * PMI_AUTO_CANCEL_LTV;

  const schedule = buildHousingSchedule({
    loanAmount,
    ratePercent: input.ratePercent,
    termMonths: Math.round(input.termYears * 12),
    extraMonthly: input.extraMonthly,
    monthlyTax: input.propertyTaxAnnual / 12,
    monthlyInsurance: input.insuranceAnnual / 12,
    monthlyHoa: input.hoaMonthly,
    // PMI is charged while the balance at the start of the month is above 78% of the original value.
    mortgageInsuranceFor: (_row, openingBalance) => (pmiApplies && openingBalance > cancelBalance ? monthlyPmi : 0),
  });

  const t = schedule.totals;
  const monthlyTax = input.propertyTaxAnnual / 12;
  const monthlyInsurance = input.insuranceAnnual / 12;

  return {
    loanAmount,
    downPaymentPercent: input.homePrice > 0 ? (input.downPayment / input.homePrice) * 100 : 0,
    ltv,
    pmiApplies,
    monthlyPrincipalAndInterest: schedule.monthlyPrincipalAndInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa: input.hoaMonthly,
    monthlyPmi,
    totalMonthlyPayment: schedule.monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + input.hoaMonthly + monthlyPmi,
    schedule,
    totalInterest: t.interest,
    totalPmi: t.mortgageInsurance,
    totalCost:
      input.downPayment + t.principal + t.extraPrincipal + t.interest + t.mortgageInsurance + t.tax + t.insurance + t.hoa,
    payoffMonths: schedule.rows.length,
    pmiLastMonth: schedule.mortgageInsuranceMonths,
  };
}
