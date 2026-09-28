import { formatCurrency, formatMonths, formatPercent } from "@/lib/format";
import type { ChartSpec, FieldDefinition, FieldErrors, ResultValue, TableSpec } from "../../types";
import { defineCalculator } from "../../types";
import { simulateDebtPayoff, type Debt, type PayoffStrategy } from "./logic";

const SLOTS = [1, 2, 3, 4] as const;
const DEFAULTS: Record<(typeof SLOTS)[number], [number, number, number]> = {
  1: [6_000, 22.9, 180],
  2: [12_000, 7.5, 350],
  3: [18_000, 5.5, 200],
  4: [0, 0, 0],
};

type Values = Record<string, number | string> & { extra: number; strategy: string };

function debtFields(n: (typeof SLOTS)[number]): FieldDefinition<string>[] {
  const [balance, rate, payment] = DEFAULTS[n];
  const group = `debt${n}`;
  return [
    { key: `b${n}`, label: "Balance", type: "number", format: "currency", default: balance, min: 0, max: 10_000_000, step: 100, group, optional: true },
    { key: `r${n}`, label: "Interest rate (APR)", type: "number", format: "percent", default: rate, min: 0, max: 100, step: 0.1, group, optional: true },
    { key: `p${n}`, label: "Minimum payment", type: "number", format: "currency", default: payment, min: 0, max: 1_000_000, step: 10, group, optional: true },
  ];
}

function readDebts(v: Values): Debt[] {
  return SLOTS.map((n) => ({
    label: `Debt ${n}`,
    balance: Number(v[`b${n}`]),
    aprPercent: Number(v[`r${n}`]),
    minPayment: Number(v[`p${n}`]),
  }));
}

export default defineCalculator<Values>({
  slug: "debt-payoff",
  groups: [
    { id: "plan", label: "Payoff plan" },
    { id: "debt1", label: "Debt 1" },
    { id: "debt2", label: "Debt 2" },
    { id: "debt3", label: "Debt 3" },
    { id: "debt4", label: "Debt 4 (optional)", collapsible: true },
  ],
  fields: [
    { key: "extra", label: "Extra payment each month", type: "number", format: "currency", default: 200, min: 0, max: 1_000_000, step: 25, group: "plan", optional: true },
    {
      key: "strategy",
      label: "Payoff strategy",
      type: "select",
      display: "segmented",
      default: "avalanche",
      group: "plan",
      options: [
        { value: "avalanche", label: "Avalanche (highest rate)" },
        { value: "snowball", label: "Snowball (smallest balance)" },
      ],
      fullWidth: true,
    },
    ...SLOTS.flatMap(debtFields),
  ],
  validate: (v) => {
    const errors: FieldErrors = {};
    const debts = readDebts(v);
    if (!debts.some((d) => d.balance > 0)) errors.b1 = "Enter at least one debt balance.";
    debts.forEach((d, i) => {
      if (d.balance > 0 && d.minPayment <= 0) errors[`p${i + 1}`] = "Enter the minimum payment for this debt.";
    });
    return errors;
  },
  compute: (v) => {
    const debts = readDebts(v);
    const strategy = v.strategy as PayoffStrategy;
    const plan = simulateDebtPayoff({ debts, extraMonthly: v.extra, strategy });
    const minimumsOnly = simulateDebtPayoff({ debts, extraMonthly: 0, strategy, rollover: false });
    const other = simulateDebtPayoff({ debts, extraMonthly: v.extra, strategy: strategy === "avalanche" ? "snowball" : "avalanche" });
    const activeIdx = debts.map((d, i) => (d.balance > 0 ? i : -1)).filter((i) => i >= 0);

    const warnings: string[] = [];
    if (!plan.paidOff) {
      warnings.push("At this payment level the debts are not paid off within 50 years — payments barely cover the interest. Increase the extra payment to see a payoff date.");
    }

    const insights: string[] = [];
    if (plan.paidOff && minimumsOnly.paidOff) {
      insights.push(
        `Compared with paying only the minimums, this plan saves ${formatCurrency(minimumsOnly.totalInterest - plan.totalInterest, 0)} in interest and gets you debt-free ${formatMonths(minimumsOnly.months - plan.months)} sooner.`,
      );
    } else if (plan.paidOff && !minimumsOnly.paidOff) {
      insights.push("Paying only the minimums would not clear these debts within 50 years; your extra payments make the difference.");
    }
    if (plan.paidOff && other.paidOff) {
      const diff = other.totalInterest - plan.totalInterest;
      const otherName = strategy === "avalanche" ? "snowball" : "avalanche";
      insights.push(
        Math.abs(diff) < 1
          ? `The ${otherName} method would cost the same in interest for these debts.`
          : diff > 0
            ? `The ${strategy} method saves ${formatCurrency(diff, 0)} in interest versus the ${otherName} method.`
            : `The ${otherName} method would save ${formatCurrency(-diff, 0)} in interest, but ${strategy} may pay off your first debt sooner.`,
      );
    }

    const order: ResultValue[] = activeIdx
      .map((i) => ({ i, month: plan.payoffMonth[i]! }))
      .sort((a, b) => a.month - b.month)
      .map(({ i, month }) => ({
        label: `Debt ${i + 1} · ${formatCurrency(debts[i]!.balance, 0)} at ${formatPercent(debts[i]!.aprPercent)}`,
        value: month,
        format: "months",
        hint: Number.isFinite(month) ? "until paid off" : "not paid off",
      }));

    // Chart: remaining balance per debt, sampled to keep the chart light.
    const step = plan.timeline.length > 120 ? 3 : 1;
    const chart: ChartSpec = {
      id: "balances",
      title: "Balances over time",
      kind: "stacked-area",
      xKey: "month",
      xLabel: "Month",
      series: activeIdx.map((i, n) => ({ key: `d${i + 1}`, label: `Debt ${i + 1}`, color: ((n % 5) + 1) as 1 | 2 | 3 | 4 | 5 })),
      data: [
        { month: 0, ...Object.fromEntries(activeIdx.map((i) => [`d${i + 1}`, debts[i]!.balance])) },
        ...plan.timeline
          .filter((_, index) => index % step === step - 1 || index === plan.timeline.length - 1)
          .map((point) => ({ month: point.month, ...Object.fromEntries(activeIdx.map((i) => [`d${i + 1}`, point.balances[i]!])) })),
      ],
      valueFormat: "currencyWhole",
    };

    const yearly: Record<string, number>[] = [];
    for (let y = 1; y * 12 - 11 <= plan.timeline.length; y++) {
      const end = plan.timeline[Math.min(y * 12, plan.timeline.length) - 1]!;
      yearly.push({ year: y, balance: end.balances.reduce((s, b) => s + b, 0) });
    }
    const table: TableSpec = {
      id: "schedule",
      title: "Remaining balance by year",
      views: [
        {
          id: "yearly",
          label: "Yearly",
          columns: [
            { key: "year", label: "Year", format: "integer" },
            ...activeIdx.map((i) => ({ key: `d${i + 1}`, label: `Debt ${i + 1}`, format: "currencyWhole" as const })),
            { key: "balance", label: "Total remaining", format: "currencyWhole" },
          ],
          rows: yearly.map((row) => {
            const end = plan.timeline[Math.min(row.year! * 12, plan.timeline.length) - 1]!;
            return { ...row, ...Object.fromEntries(activeIdx.map((i) => [`d${i + 1}`, end.balances[i]!])) };
          }),
        },
      ],
    };

    return {
      primary: { label: "Debt-free in", value: plan.months, format: "months", hint: plan.paidOff ? `Paying ${formatCurrency(plan.monthlyBudget, 0)} per month` : undefined },
      secondary: [
        { label: "Total interest", value: plan.totalInterest, format: "currencyWhole", tone: "negative" },
        { label: "Total paid", value: plan.totalPaid, format: "currencyWhole" },
        { label: "Monthly payment budget", value: plan.monthlyBudget, format: "currency" },
        { label: "Total debt today", value: debts.reduce((s, d) => s + d.balance, 0), format: "currencyWhole" },
      ],
      sections: [{ title: "Payoff order", description: `Using the ${strategy} method with rollover of freed-up payments.`, items: order }],
      charts: plan.paidOff ? [chart] : [],
      tables: plan.paidOff ? [table] : [],
      insights,
      warnings,
    };
  },
});
