import { formatCurrency, formatMonths } from "@/lib/format";
import { defineCalculator } from "../../types";
import { payoffWithFixedPayment, payoffWithMinimums, paymentForMonths } from "./logic";

type Values = { balance: number; apr: number; mode: string; payment: number; months: number };

export default defineCalculator<Values>({
  slug: "credit-card-payoff",
  fields: [
    { key: "balance", label: "Card balance", type: "number", format: "currency", default: 8_000, min: 1, max: 10_000_000, step: 100 },
    { key: "apr", label: "Interest rate (APR)", type: "number", format: "percent", default: 24, min: 0, max: 80, step: 0.1 },
    {
      key: "mode",
      label: "I want to",
      type: "select",
      display: "segmented",
      default: "payment",
      fullWidth: true,
      options: [
        { value: "payment", label: "Pay a fixed amount" },
        { value: "months", label: "Pay off by a date" },
      ],
    },
    { key: "payment", label: "Monthly payment", type: "number", format: "currency", default: 300, min: 1, max: 1_000_000, step: 10, visibleWhen: (v) => v.mode === "payment" },
    { key: "months", label: "Months to pay off", type: "number", format: "integer", default: 24, min: 1, max: 360, step: 1, suffix: "months", visibleWhen: (v) => v.mode === "months" },
  ],
  validate: (v) => {
    if (v.mode === "payment" && v.apr > 0 && v.payment <= (v.balance * v.apr) / 1200) {
      return { payment: `This payment doesn't cover the monthly interest of ${formatCurrency((v.balance * v.apr) / 1200)}. Increase it to make progress.` };
    }
    return {};
  },
  compute: (v) => {
    const payment = v.mode === "months" ? paymentForMonths(v.balance, v.apr, v.months) : v.payment;
    const plan = payoffWithFixedPayment(v.balance, v.apr, payment);
    const minimum = payoffWithMinimums(v.balance, v.apr);
    const monthlyInterest = (v.balance * v.apr) / 1200;

    const insights = [
      `Your first payment includes about ${formatCurrency(monthlyInterest)} of interest; the rest (${formatCurrency(payment - monthlyInterest)}) reduces the balance.`,
    ];
    if (minimum.paidOff && plan.paidOff && minimum.totalInterest > plan.totalInterest) {
      insights.push(
        `Paying only a typical minimum (interest + 1% of the balance, at least $25) would take ${formatMonths(minimum.months)} and cost ${formatCurrency(minimum.totalInterest, 0)} in interest — ${formatCurrency(minimum.totalInterest - plan.totalInterest, 0)} more than this plan.`,
      );
    }
    insights.push(`Interest adds ${formatCurrency(plan.totalInterest, 0)} (${Math.round((plan.totalInterest / v.balance) * 100)}% of the balance) to what you repay.`);

    return {
      primary:
        v.mode === "months"
          ? { label: "Required monthly payment", value: payment, format: "currency", hint: `To be debt-free in ${formatMonths(v.months)}` }
          : { label: "Time to pay off", value: plan.months, format: "months", hint: `Paying ${formatCurrency(payment)} per month` },
      secondary: [
        ...(v.mode === "months"
          ? [{ label: "Payoff time", value: plan.months, format: "months" as const }]
          : [{ label: "Monthly payment", value: payment, format: "currency" as const }]),
        { label: "Total interest", value: plan.totalInterest, format: "currency", tone: "negative" },
        { label: "Total paid", value: plan.totalPaid, format: "currency" },
        { label: "Interest this month", value: monthlyInterest, format: "currency" },
      ],
      charts: [
        {
          id: "balance",
          title: "Balance over time",
          kind: "area",
          xKey: "month",
          xLabel: "Month",
          series: [{ key: "balance", label: "Balance", color: 1 }],
          data: [{ month: 0, balance: v.balance }, ...plan.rows.map((r) => ({ month: r.month, balance: r.balance }))],
          valueFormat: "currency",
        },
        {
          id: "split",
          title: "Where your payments go",
          kind: "donut",
          xKey: "label",
          series: [{ key: "value", label: "Amount" }],
          data: [
            { label: "Balance repaid", value: v.balance },
            { label: "Interest", value: plan.totalInterest },
          ],
          valueFormat: "currency",
        },
      ],
      tables: [
        {
          id: "schedule",
          title: "Payoff schedule",
          views: [
            {
              id: "monthly",
              label: "Monthly",
              columns: [
                { key: "month", label: "Month", format: "integer" },
                { key: "payment", label: "Payment", format: "currency" },
                { key: "interest", label: "Interest", format: "currency" },
                { key: "principal", label: "Principal", format: "currency" },
                { key: "balance", label: "Balance", format: "currency" },
              ],
              rows: plan.rows.map((r) => ({ ...r })),
              initialRows: 24,
            },
          ],
        },
      ],
      insights,
    };
  },
});
