export interface Debt {
  label: string;
  balance: number;
  aprPercent: number;
  minPayment: number;
}

export type PayoffStrategy = "avalanche" | "snowball";

export interface DebtPayoffInput {
  debts: Debt[];
  /** Paid on top of all minimum payments every month. */
  extraMonthly: number;
  strategy: PayoffStrategy;
  /**
   * Snowball/avalanche "rollover": when a debt is paid off, its minimum payment
   * keeps going toward the remaining debts. Disable to model minimums only.
   */
  rollover?: boolean;
}

export interface DebtPayoffResult {
  months: number;
  paidOff: boolean;
  totalInterest: number;
  totalPaid: number;
  monthlyBudget: number;
  /** Month each debt reaches zero (same order as input). Infinity if never. */
  payoffMonth: number[];
  /** Balance of each debt at the end of every month. */
  timeline: { month: number; balances: number[] }[];
}

/** Safety cap: 50 years of months. */
export const MAX_MONTHS = 600;

function priorityOrder(debts: { balance: number; aprPercent: number }[], strategy: PayoffStrategy): number[] {
  return debts
    .map((debt, index) => ({ ...debt, index }))
    .filter((debt) => debt.balance > 0)
    .sort((a, b) =>
      strategy === "avalanche"
        ? b.aprPercent - a.aprPercent || a.balance - b.balance
        : a.balance - b.balance || b.aprPercent - a.aprPercent,
    )
    .map((debt) => debt.index);
}

/**
 * Month-by-month payoff simulation:
 * 1. Interest accrues on each balance at APR ÷ 12.
 * 2. Each open debt receives its minimum payment (capped at its balance).
 * 3. Whatever budget remains goes to the highest-priority debt, then the next.
 */
export function simulateDebtPayoff({ debts, extraMonthly, strategy, rollover = true }: DebtPayoffInput): DebtPayoffResult {
  const active = debts.filter((d) => d.balance > 0);
  const monthlyBudget = active.reduce((sum, d) => sum + d.minPayment, 0) + extraMonthly;
  const balances = debts.map((d) => Math.max(0, d.balance));
  const payoffMonth = debts.map((d) => (d.balance > 0 ? Infinity : 0));
  const timeline: DebtPayoffResult["timeline"] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  while (balances.some((b) => b > 0.005) && month < MAX_MONTHS) {
    month++;
    balances.forEach((balance, i) => {
      if (balance <= 0) return;
      const interest = (balance * debts[i]!.aprPercent) / 100 / 12;
      balances[i] = balance + interest;
      totalInterest += interest;
    });

    // Without rollover, the budget shrinks as debts are paid off.
    let budget = rollover
      ? monthlyBudget
      : debts.reduce((sum, d, i) => sum + (balances[i]! > 0 ? d.minPayment : 0), 0) + extraMonthly;

    balances.forEach((balance, i) => {
      if (balance <= 0) return;
      const payment = Math.min(debts[i]!.minPayment, balance, budget);
      balances[i] = balance - payment;
      budget -= payment;
      totalPaid += payment;
    });

    for (const i of priorityOrder(debts.map((d, idx) => ({ balance: balances[idx]!, aprPercent: d.aprPercent })), strategy)) {
      if (budget <= 0) break;
      const payment = Math.min(budget, balances[i]!);
      balances[i] = balances[i]! - payment;
      budget -= payment;
      totalPaid += payment;
    }

    balances.forEach((balance, i) => {
      if (balance <= 0.005 && payoffMonth[i] === Infinity) {
        balances[i] = 0;
        payoffMonth[i] = month;
      }
    });
    timeline.push({ month, balances: [...balances] });
  }

  const paidOff = balances.every((b) => b <= 0.005);
  return { months: paidOff ? month : Infinity, paidOff, totalInterest, totalPaid, monthlyBudget, payoffMonth, timeline };
}
