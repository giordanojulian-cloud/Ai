import { loanPayment } from "@/lib/finance";

export interface CardScheduleRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface CardPayoff {
  months: number;
  paidOff: boolean;
  totalInterest: number;
  totalPaid: number;
  rows: CardScheduleRow[];
}

export const MAX_MONTHS = 600;

/** Pays a card down with a payment that may depend on the balance. Interest accrues monthly at APR ÷ 12. */
export function simulateCardPayoff(balance: number, aprPercent: number, paymentFor: (balance: number, interest: number) => number): CardPayoff {
  const r = aprPercent / 100 / 12;
  const rows: CardScheduleRow[] = [];
  let remaining = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  for (let month = 1; remaining > 0.005 && month <= MAX_MONTHS; month++) {
    const interest = remaining * r;
    const due = remaining + interest;
    const payment = Math.min(paymentFor(remaining, interest), due);
    if (payment <= interest && payment < due) {
      // Payment never reduces the balance.
      return { months: Infinity, paidOff: false, totalInterest, totalPaid, rows };
    }
    remaining = due - payment;
    if (remaining < 0.005) remaining = 0;
    totalInterest += interest;
    totalPaid += payment;
    rows.push({ month, payment, interest, principal: payment - interest, balance: remaining });
  }
  const paidOff = remaining === 0;
  return { months: paidOff ? rows.length : Infinity, paidOff, totalInterest, totalPaid, rows };
}

export function payoffWithFixedPayment(balance: number, aprPercent: number, payment: number): CardPayoff {
  return simulateCardPayoff(balance, aprPercent, () => payment);
}

/** Fixed payment needed to clear the balance in `months`. */
export function paymentForMonths(balance: number, aprPercent: number, months: number): number {
  return loanPayment(balance, aprPercent, months);
}

/**
 * A common issuer minimum-payment formula: interest + a percent of the
 * balance, with a dollar floor. Issuers vary; see content assumptions.
 */
export function payoffWithMinimums(balance: number, aprPercent: number, principalPercent = 1, floor = 25): CardPayoff {
  return simulateCardPayoff(balance, aprPercent, (remaining, interest) => Math.max(interest + (remaining * principalPercent) / 100, floor));
}
