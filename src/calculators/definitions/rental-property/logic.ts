import { loanPayment } from "@/lib/finance";
import { capRate, cashOnCash, dscr, effectiveGrossIncome, netOperatingIncome } from "../../shared/property";

export interface RentalInput {
  price: number;
  downPayment: number;
  ratePercent: number;
  termYears: number;
  closingCosts: number;
  rehabCosts: number;
  monthlyRent: number;
  vacancyPercent: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
  maintenancePercent: number; // % of gross scheduled rent
  managementPercent: number; // % of collected rent (after vacancy)
  utilitiesMonthly: number;
  otherMonthly: number;
}

export interface RentalResult {
  loanAmount: number;
  grossRentAnnual: number;
  vacancyLoss: number;
  effectiveIncome: number;
  expenses: { label: string; annual: number }[];
  operatingExpenses: number;
  noi: number;
  monthlyDebtService: number;
  annualDebtService: number;
  annualCashFlow: number;
  monthlyCashFlow: number;
  cashInvested: number;
  capRatePercent: number;
  cashOnCashPercent: number;
  dscr: number;
  grossRentMultiplier: number;
  onePercentRule: number; // monthly rent ÷ price, %
}

export function analyzeRental(i: RentalInput): RentalResult {
  const loanAmount = Math.max(0, i.price - i.downPayment);
  const monthlyDebtService = loanPayment(loanAmount, i.ratePercent, i.termYears * 12);
  const grossRentAnnual = i.monthlyRent * 12;
  const effectiveIncome = effectiveGrossIncome(grossRentAnnual, i.vacancyPercent);
  const expenses = [
    { label: "Property tax", annual: i.propertyTaxAnnual },
    { label: "Insurance", annual: i.insuranceAnnual },
    { label: "HOA", annual: i.hoaMonthly * 12 },
    { label: "Maintenance & repairs", annual: (grossRentAnnual * i.maintenancePercent) / 100 },
    { label: "Property management", annual: (effectiveIncome * i.managementPercent) / 100 },
    { label: "Utilities", annual: i.utilitiesMonthly * 12 },
    { label: "Other", annual: i.otherMonthly * 12 },
  ];
  const operatingExpenses = expenses.reduce((sum, e) => sum + e.annual, 0);
  const noi = netOperatingIncome(effectiveIncome, operatingExpenses);
  const annualDebtService = monthlyDebtService * 12;
  const annualCashFlow = noi - annualDebtService;
  const cashInvested = i.downPayment + i.closingCosts + i.rehabCosts;
  return {
    loanAmount,
    grossRentAnnual,
    vacancyLoss: grossRentAnnual - effectiveIncome,
    effectiveIncome,
    expenses,
    operatingExpenses,
    noi,
    monthlyDebtService,
    annualDebtService,
    annualCashFlow,
    monthlyCashFlow: annualCashFlow / 12,
    cashInvested,
    capRatePercent: capRate(noi, i.price),
    cashOnCashPercent: cashOnCash(annualCashFlow, cashInvested),
    dscr: dscr(noi, annualDebtService),
    grossRentMultiplier: grossRentAnnual > 0 ? i.price / grossRentAnnual : 0,
    onePercentRule: i.price > 0 ? (i.monthlyRent / i.price) * 100 : 0,
  };
}
