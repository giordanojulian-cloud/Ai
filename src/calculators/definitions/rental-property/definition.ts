import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { amountFromUnit } from "../../shared/housing";
import { defineCalculator } from "../../types";
import { analyzeRental } from "./logic";

type Values = {
  price: number;
  down: number;
  downUnit: string;
  rate: number;
  term: string;
  closing: number;
  rehab: number;
  rent: number;
  vacancy: number;
  tax: number;
  insurance: number;
  hoa: number;
  maintenance: number;
  management: number;
  utilities: number;
  other: number;
};

export default defineCalculator<Values>({
  slug: "rental-property",
  groups: [
    { id: "purchase", label: "Purchase & financing" },
    { id: "income", label: "Income" },
    { id: "expenses", label: "Operating expenses" },
  ],
  fields: [
    { key: "price", label: "Purchase price", type: "number", format: "currency", default: 300_000, min: 1_000, max: 100_000_000, step: 1_000, group: "purchase" },
    {
      key: "down",
      label: "Down payment",
      type: "number",
      format: "percent",
      default: 25,
      min: 0,
      group: "purchase",
      unit: {
        key: "downUnit",
        default: "percent",
        baseKey: "price",
        options: [
          { value: "percent", label: "%", format: "percent", min: 0, max: 100, step: 1 },
          { value: "amount", label: "$", format: "currency", min: 0, max: 100_000_000, step: 1_000 },
        ],
      },
    },
    { key: "rate", label: "Interest rate", type: "number", format: "percent", default: 7, min: 0, max: 20, step: 0.125, group: "purchase" },
    {
      key: "term",
      label: "Loan term",
      type: "select",
      display: "segmented",
      default: "30",
      group: "purchase",
      options: [
        { value: "30", label: "30 years" },
        { value: "15", label: "15 years" },
      ],
    },
    { key: "closing", label: "Closing costs", type: "number", format: "currency", default: 9_000, min: 0, max: 10_000_000, step: 500, group: "purchase", optional: true },
    { key: "rehab", label: "Rehab / repair costs", type: "number", format: "currency", default: 10_000, min: 0, max: 10_000_000, step: 500, group: "purchase", optional: true },
    { key: "rent", label: "Monthly rent", type: "number", format: "currency", default: 2_800, min: 0, max: 1_000_000, step: 50, group: "income" },
    { key: "vacancy", label: "Vacancy rate", type: "number", format: "percent", default: 5, min: 0, max: 100, step: 1, group: "income" },
    { key: "tax", label: "Property tax (annual)", type: "number", format: "currency", default: 3_600, min: 0, max: 1_000_000, step: 100, group: "expenses", optional: true },
    { key: "insurance", label: "Insurance (annual)", type: "number", format: "currency", default: 1_500, min: 0, max: 1_000_000, step: 100, group: "expenses", optional: true },
    { key: "hoa", label: "HOA (monthly)", type: "number", format: "currency", default: 0, min: 0, max: 100_000, step: 25, group: "expenses", optional: true },
    { key: "maintenance", label: "Maintenance", type: "number", format: "percent", default: 5, min: 0, max: 50, step: 0.5, group: "expenses", optional: true, help: "Percent of gross rent." },
    { key: "management", label: "Property management", type: "number", format: "percent", default: 8, min: 0, max: 50, step: 0.5, group: "expenses", optional: true, help: "Percent of collected rent." },
    { key: "utilities", label: "Utilities (monthly)", type: "number", format: "currency", default: 0, min: 0, max: 100_000, step: 25, group: "expenses", optional: true },
    { key: "other", label: "Other expenses (monthly)", type: "number", format: "currency", default: 100, min: 0, max: 100_000, step: 25, group: "expenses", optional: true, help: "CapEx reserve, landscaping, pest control…" },
  ],
  validate: (v) => (amountFromUnit(v.down, v.downUnit, v.price) > v.price ? { down: "Down payment can't exceed the purchase price." } : {}),
  compute: (v) => {
    const r = analyzeRental({
      price: v.price,
      downPayment: amountFromUnit(v.down, v.downUnit, v.price),
      ratePercent: v.rate,
      termYears: Number(v.term),
      closingCosts: v.closing,
      rehabCosts: v.rehab,
      monthlyRent: v.rent,
      vacancyPercent: v.vacancy,
      propertyTaxAnnual: v.tax,
      insuranceAnnual: v.insurance,
      hoaMonthly: v.hoa,
      maintenancePercent: v.maintenance,
      managementPercent: v.management,
      utilitiesMonthly: v.utilities,
      otherMonthly: v.other,
    });
    const positive = r.annualCashFlow >= 0;
    const tone = positive ? ("positive" as const) : ("negative" as const);

    const summary: string[] = [
      `After vacancy and ${formatCurrency(r.operatingExpenses, 0)} of annual operating expenses, the property produces ${formatCurrency(r.noi, 0)} of net operating income — a ${formatPercent(r.capRatePercent)} cap rate on the purchase price.`,
      positive
        ? `After the ${formatCurrency(r.monthlyDebtService, 0)} monthly mortgage payment, it cash-flows ${formatCurrency(r.monthlyCashFlow, 0)} a month, a ${formatPercent(r.cashOnCashPercent)} cash-on-cash return on ${formatCurrency(r.cashInvested, 0)} invested.`
        : `The ${formatCurrency(r.monthlyDebtService, 0)} monthly mortgage payment exceeds the net operating income, so you'd contribute about ${formatCurrency(-r.monthlyCashFlow, 0)} a month to hold it.`,
      Number.isFinite(r.dscr)
        ? `The debt service coverage ratio is ${formatNumber(r.dscr, 2)}. Many lenders look for at least 1.20–1.25 on investment loans.`
        : "With no mortgage, all net operating income is cash flow.",
    ];

    return {
      primary: { label: "Monthly cash flow", value: r.monthlyCashFlow, format: "currency", tone, hint: "Before income taxes" },
      secondary: [
        { label: "Annual cash flow", value: r.annualCashFlow, format: "currency", tone },
        { label: "Cash-on-cash return", value: r.cashOnCashPercent, format: "percent", tone },
        { label: "Cap rate", value: r.capRatePercent, format: "percent" },
        { label: "Net operating income", value: r.noi, format: "currency", hint: "per year" },
        { label: "Total cash invested", value: r.cashInvested, format: "currency", hint: "Down payment + closing + rehab" },
        { label: "Debt service", value: r.annualDebtService, format: "currency", hint: `${formatCurrency(r.monthlyDebtService)} per month` },
        { label: "Operating expenses", value: r.operatingExpenses, format: "currency", hint: "per year" },
        { label: "Gross rental income", value: r.grossRentAnnual, format: "currency", hint: "per year, before vacancy" },
      ],
      sections: [
        {
          title: "Investment summary",
          items: [
            { label: "Debt service coverage (DSCR)", value: r.dscr, format: "number" },
            { label: "Gross rent multiplier", value: r.grossRentMultiplier, format: "number", hint: "Price ÷ annual rent" },
            { label: "Rent-to-price (1% rule)", value: r.onePercentRule, format: "percent", hint: r.onePercentRule >= 1 ? "Meets the 1% rule" : "Below the 1% rule" },
            { label: "Vacancy loss", value: r.vacancyLoss, format: "currency", hint: "per year" },
          ],
        },
      ],
      charts: [
        {
          id: "waterfall",
          title: "Where the rent goes (annual)",
          kind: "bar",
          xKey: "label",
          series: [{ key: "value", label: "Amount", color: 1 }],
          data: [
            { label: "Gross rent", value: r.grossRentAnnual },
            { label: "Vacancy", value: r.vacancyLoss },
            { label: "Expenses", value: r.operatingExpenses },
            { label: "Debt service", value: r.annualDebtService },
            { label: "Cash flow", value: r.annualCashFlow },
          ],
          valueFormat: "currencyWhole",
        },
        {
          id: "expenses",
          title: "Operating expenses",
          kind: "donut",
          xKey: "label",
          series: [{ key: "value", label: "Annual" }],
          data: r.expenses.filter((e) => e.annual > 0).map((e) => ({ label: e.label, value: e.annual })),
          valueFormat: "currency",
        },
      ],
      tables: [
        {
          id: "pro-forma",
          title: "Annual pro forma",
          views: [
            {
              id: "annual",
              label: "Year 1",
              columns: [
                { key: "line", label: "Line item", align: "left" },
                { key: "annual", label: "Annual", format: "currency" },
                { key: "monthly", label: "Monthly", format: "currency" },
              ],
              rows: [
                { line: "Gross scheduled rent", annual: r.grossRentAnnual, monthly: r.grossRentAnnual / 12 },
                { line: "Less vacancy", annual: -r.vacancyLoss, monthly: -r.vacancyLoss / 12 },
                { line: "Effective gross income", annual: r.effectiveIncome, monthly: r.effectiveIncome / 12 },
                ...r.expenses.filter((e) => e.annual > 0).map((e) => ({ line: `Less ${e.label.toLowerCase()}`, annual: -e.annual, monthly: -e.annual / 12 })),
                { line: "Net operating income", annual: r.noi, monthly: r.noi / 12 },
                { line: "Less debt service", annual: -r.annualDebtService, monthly: -r.monthlyDebtService },
              ],
              footer: { line: "Cash flow", annual: r.annualCashFlow, monthly: r.monthlyCashFlow },
            },
          ],
        },
      ],
      insights: summary,
    };
  },
});
