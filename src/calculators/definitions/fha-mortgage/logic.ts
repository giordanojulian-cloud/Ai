import { amortizationSchedule } from "@/lib/finance";
import { buildHousingSchedule, type HousingSchedule } from "../../shared/housing";
import { annualMipRate, FHA_RULES, mipDurationMonths } from "./fha-rules";

export interface FhaInput {
  price: number;
  downPayment: number;
  ratePercent: number;
  termYears: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
  upfrontMipPercent: number;
  /** Annual MIP rate; `undefined` uses the HUD table. */
  annualMipPercent?: number;
  financeUpfrontMip: boolean;
}

export interface FhaResult {
  baseLoan: number;
  upfrontMip: number;
  totalLoan: number;
  ltvPercent: number;
  annualMipPercent: number;
  mipMonths: number;
  monthlyPrincipalAndInterest: number;
  monthlyMipFirstYear: number;
  monthlyTax: number;
  monthlyInsurance: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalMip: number;
  schedule: HousingSchedule;
  meetsMinimumDown: boolean;
}

/**
 * Annual MIP is estimated each loan year as rate × the average scheduled
 * balance over that year's 12 months ÷ 12, charged for the MIP duration.
 */
export function calculateFha(input: FhaInput): FhaResult {
  const baseLoan = Math.max(0, input.price - input.downPayment);
  const ltvPercent = input.price > 0 ? (baseLoan / input.price) * 100 : 0;
  const upfrontMip = (baseLoan * input.upfrontMipPercent) / 100;
  const totalLoan = baseLoan + (input.financeUpfrontMip ? upfrontMip : 0);
  const termMonths = Math.round(input.termYears * 12);
  const annualMipPercent = input.annualMipPercent ?? annualMipRate(input.termYears, baseLoan, ltvPercent);
  const mipMonths = mipDurationMonths(termMonths, ltvPercent);

  const plain = amortizationSchedule(totalLoan, input.ratePercent, termMonths);
  const yearlyMonthlyMip: number[] = [];
  for (let start = 0; start < plain.length; start += 12) {
    const months = plain.slice(start, start + 12);
    const openingBalances = months.map((row, i) => (start + i === 0 ? totalLoan : plain[start + i - 1]!.balance));
    const average = openingBalances.reduce((s, b) => s + b, 0) / openingBalances.length;
    yearlyMonthlyMip.push((average * annualMipPercent) / 100 / 12);
  }

  const schedule = buildHousingSchedule({
    loanAmount: totalLoan,
    ratePercent: input.ratePercent,
    termMonths,
    monthlyTax: input.propertyTaxAnnual / 12,
    monthlyInsurance: input.insuranceAnnual / 12,
    monthlyHoa: input.hoaMonthly,
    mortgageInsuranceFor: (row) => (row.period <= mipMonths ? (yearlyMonthlyMip[Math.ceil(row.period / 12) - 1] ?? 0) : 0),
  });

  const monthlyMipFirstYear = yearlyMonthlyMip[0] ?? 0;
  const monthlyTax = input.propertyTaxAnnual / 12;
  const monthlyInsurance = input.insuranceAnnual / 12;
  return {
    baseLoan,
    upfrontMip,
    totalLoan,
    ltvPercent,
    annualMipPercent,
    mipMonths,
    monthlyPrincipalAndInterest: schedule.monthlyPrincipalAndInterest,
    monthlyMipFirstYear,
    monthlyTax,
    monthlyInsurance,
    totalMonthlyPayment: schedule.monthlyPrincipalAndInterest + monthlyMipFirstYear + monthlyTax + monthlyInsurance + input.hoaMonthly,
    totalInterest: schedule.totals.interest,
    totalMip: schedule.totals.mortgageInsurance,
    schedule,
    meetsMinimumDown: 100 - ltvPercent >= FHA_RULES.minDownPaymentPercent - 1e-9,
  };
}
