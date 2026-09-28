import { formatCurrency, formatNumber } from "@/lib/format";
import { defineCalculator } from "../../types";
import { payEquivalents } from "./logic";

type Values = { mode: string; salary: number; hourly: number; hours: number; days: number; weeks: number };

export default defineCalculator<Values>({
  slug: "salary-to-hourly",
  fields: [
    {
      key: "mode",
      label: "Convert",
      type: "select",
      display: "segmented",
      default: "salary-to-hourly",
      fullWidth: true,
      options: [
        { value: "salary-to-hourly", label: "Salary → hourly" },
        { value: "hourly-to-salary", label: "Hourly → salary" },
      ],
    },
    { key: "salary", label: "Annual salary", type: "number", format: "currency", default: 65_000, min: 1, max: 100_000_000, step: 1_000, visibleWhen: (v) => v.mode === "salary-to-hourly" },
    { key: "hourly", label: "Hourly rate", type: "number", format: "currency", default: 31.25, min: 0.01, max: 100_000, step: 0.25, visibleWhen: (v) => v.mode === "hourly-to-salary" },
    { key: "hours", label: "Hours per week", type: "number", format: "number", default: 40, min: 1, max: 168, step: 1, suffix: "hrs" },
    { key: "days", label: "Days per week", type: "number", format: "number", default: 5, min: 1, max: 7, step: 0.5, suffix: "days" },
    { key: "weeks", label: "Weeks worked per year", type: "number", format: "number", default: 52, min: 1, max: 52, step: 1, suffix: "weeks", help: "Use 52 if paid time off is paid. Subtract unpaid weeks off." },
  ],
  compute: (v) => {
    const toHourly = v.mode === "salary-to-hourly";
    const p = payEquivalents({
      mode: toHourly ? "salary-to-hourly" : "hourly-to-salary",
      amount: toHourly ? v.salary : v.hourly,
      hoursPerWeek: v.hours,
      daysPerWeek: v.days,
      weeksPerYear: v.weeks,
    });
    const rows = [
      { period: "Hourly", amount: p.hourly },
      { period: "Daily", amount: p.daily },
      { period: "Weekly", amount: p.weekly },
      { period: "Biweekly (26 per year)", amount: p.biweekly },
      { period: "Semimonthly (24 per year)", amount: p.semimonthly },
      { period: "Monthly", amount: p.monthly },
      { period: "Annual", amount: p.annual },
    ];
    return {
      primary: toHourly
        ? { label: "Hourly rate", value: p.hourly, format: "currency", hint: `Based on ${formatNumber(p.hoursPerYear, 0)} hours per year` }
        : { label: "Annual salary", value: p.annual, format: "currencyWhole", hint: `Based on ${formatNumber(p.hoursPerYear, 0)} hours per year` },
      secondary: [
        { label: "Monthly", value: p.monthly, format: "currency" },
        { label: "Biweekly", value: p.biweekly, format: "currency" },
        { label: "Weekly", value: p.weekly, format: "currency" },
        { label: "Daily", value: p.daily, format: "currency" },
      ],
      tables: [
        {
          id: "equivalents",
          title: "Pay by period (before taxes)",
          views: [
            {
              id: "all",
              label: "All periods",
              columns: [
                { key: "period", label: "Pay period", align: "left" },
                { key: "amount", label: "Gross pay", format: "currency" },
              ],
              rows,
            },
          ],
        },
      ],
      insights: [
        `${formatCurrency(p.annual, 0)} a year over ${formatNumber(p.hoursPerYear, 0)} working hours is ${formatCurrency(p.hourly)} per hour.`,
        "These are gross (pre-tax) amounts. Take-home pay will be lower after taxes, retirement contributions and benefit deductions.",
        ...(v.weeks < 52 ? [`Working ${v.weeks} weeks a year means each worked hour must cover ${52 - v.weeks} unpaid weeks, which raises the equivalent hourly rate.`] : []),
      ],
    };
  },
});
