/** Core income-property metrics shared by the rental, cap rate and cash-on-cash calculators. */

export function effectiveGrossIncome(grossAnnualIncome: number, vacancyPercent: number): number {
  return grossAnnualIncome * (1 - vacancyPercent / 100);
}

/** Net operating income: income after vacancy minus operating expenses (excludes debt service). */
export function netOperatingIncome(effectiveIncome: number, operatingExpenses: number): number {
  return effectiveIncome - operatingExpenses;
}

/** Cap rate (%) = NOI ÷ property value. */
export function capRate(noi: number, value: number): number {
  return value > 0 ? (noi / value) * 100 : 0;
}

/** Property value implied by an NOI and a target cap rate. */
export function valueFromCapRate(noi: number, capRatePercent: number): number {
  return capRatePercent > 0 ? noi / (capRatePercent / 100) : 0;
}

/** Cash-on-cash return (%) = annual pre-tax cash flow ÷ total cash invested. */
export function cashOnCash(annualCashFlow: number, cashInvested: number): number {
  return cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;
}

/** Debt service coverage ratio = NOI ÷ annual debt service. */
export function dscr(noi: number, annualDebtService: number): number {
  return annualDebtService > 0 ? noi / annualDebtService : Infinity;
}
