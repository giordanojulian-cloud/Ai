import { monthlyRateFromApr } from "./rates";

/**
 * Standard fully-amortizing payment:
 *   M = P · r(1 + r)^n / ((1 + r)^n − 1), with r = APR / 12, n = months.
 * With a 0% rate the payment is simply P / n.
 */
export function loanPayment(principal: number, aprPercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = monthlyRateFromApr(aprPercent);
  if (r === 0) return principal / months;
  const growth = (1 + r) ** months;
  return (principal * r * growth) / (growth - 1);
}

/** Remaining balance after `paymentsMade` regular payments (no extra payments). */
export function remainingBalance(principal: number, aprPercent: number, months: number, paymentsMade: number): number {
  const r = monthlyRateFromApr(aprPercent);
  const payment = loanPayment(principal, aprPercent, months);
  if (r === 0) return Math.max(0, principal - payment * paymentsMade);
  const growth = (1 + r) ** paymentsMade;
  return Math.max(0, principal * growth - payment * ((growth - 1) / r));
}

/**
 * Number of months to repay `balance` with a fixed monthly `payment`
 * (NPER). Returns Infinity when the payment never covers the interest.
 */
export function monthsToPayoff(balance: number, aprPercent: number, payment: number): number {
  if (balance <= 0) return 0;
  if (payment <= 0) return Infinity;
  const r = monthlyRateFromApr(aprPercent);
  if (r === 0) return balance / payment;
  if (payment <= balance * r) return Infinity;
  return -Math.log(1 - (balance * r) / payment) / Math.log(1 + r);
}

export interface AmortizationRow {
  /** 1-based month number. */
  period: number;
  payment: number;
  principal: number;
  interest: number;
  extraPrincipal: number;
  balance: number;
}

export interface AmortizationOptions {
  /** Additional principal paid every month. */
  extraMonthly?: number;
}

/**
 * Month-by-month schedule. Interest is charged on the opening balance each
 * month; the final payment is reduced so the balance lands exactly on zero.
 */
export function amortizationSchedule(
  principal: number,
  aprPercent: number,
  months: number,
  options: AmortizationOptions = {},
): AmortizationRow[] {
  const rows: AmortizationRow[] = [];
  if (principal <= 0 || months <= 0) return rows;
  const r = monthlyRateFromApr(aprPercent);
  const scheduled = loanPayment(principal, aprPercent, months);
  const extra = Math.max(0, options.extraMonthly ?? 0);
  let balance = principal;

  for (let period = 1; period <= months && balance > 1e-9; period++) {
    const interest = balance * r;
    let principalPart = Math.min(scheduled - interest, balance);
    const extraPart = Math.min(extra, balance - principalPart);
    principalPart = Math.max(principalPart, 0);
    balance = balance - principalPart - extraPart;
    if (balance < 1e-7) balance = 0;
    rows.push({
      period,
      payment: principalPart + interest,
      principal: principalPart,
      interest,
      extraPrincipal: extraPart,
      balance,
    });
  }
  return rows;
}

export interface AnnualAmortizationRow {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extraPrincipal: number;
  endingBalance: number;
}

export function summarizeByYear(rows: AmortizationRow[]): AnnualAmortizationRow[] {
  const years: AnnualAmortizationRow[] = [];
  for (const row of rows) {
    const year = Math.ceil(row.period / 12);
    let current = years[year - 1];
    if (!current) {
      current = { year, payment: 0, principal: 0, interest: 0, extraPrincipal: 0, endingBalance: 0 };
      years[year - 1] = current;
    }
    current.payment += row.payment;
    current.principal += row.principal;
    current.interest += row.interest;
    current.extraPrincipal += row.extraPrincipal;
    current.endingBalance = row.balance;
  }
  return years;
}
