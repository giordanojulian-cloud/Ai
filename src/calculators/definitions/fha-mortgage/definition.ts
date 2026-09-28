import { formatCurrency, formatMonths, formatPercent } from "@/lib/format";
import { amountFromUnit, amortizationTable, balanceChart } from "../../shared/housing";
import { defineCalculator } from "../../types";
import { FHA_RULES } from "./fha-rules";
import { calculateFha } from "./logic";

type Values = {
  price: number;
  down: number;
  downUnit: string;
  rate: number;
  term: string;
  tax: number;
  taxUnit: string;
  insurance: number;
  hoa: number;
  ufmip: number;
  mipMode: string;
  mipRate: number;
  financeUfmip: boolean;
};

export default defineCalculator<Values>({
  slug: "fha-mortgage",
  groups: [
    { id: "loan", label: "Home & loan" },
    { id: "costs", label: "Taxes, insurance & fees" },
    { id: "mip", label: "FHA mortgage insurance", collapsible: true, description: `Defaults follow ${FHA_RULES.source}.` },
  ],
  fields: [
    { key: "price", label: "Purchase price", type: "number", format: "currency", default: 350_000, min: 1_000, max: 10_000_000, step: 1_000, group: "loan" },
    {
      key: "down",
      label: "Down payment",
      type: "number",
      format: "percent",
      default: 3.5,
      min: 0,
      group: "loan",
      unit: {
        key: "downUnit",
        default: "percent",
        baseKey: "price",
        options: [
          { value: "percent", label: "%", format: "percent", min: 0, max: 99, step: 0.5 },
          { value: "amount", label: "$", format: "currency", min: 0, max: 10_000_000, step: 500 },
        ],
      },
      help: `FHA minimum is ${FHA_RULES.minDownPaymentPercent}% with a 580+ credit score.`,
    },
    { key: "rate", label: "Interest rate", type: "number", format: "percent", default: 6.25, min: 0, max: 20, step: 0.125, group: "loan" },
    {
      key: "term",
      label: "Loan term",
      type: "select",
      display: "segmented",
      default: "30",
      group: "loan",
      options: [
        { value: "30", label: "30 years" },
        { value: "15", label: "15 years" },
      ],
    },
    {
      key: "tax",
      label: "Property tax (annual)",
      type: "number",
      format: "percent",
      default: 1.1,
      min: 0,
      group: "costs",
      unit: {
        key: "taxUnit",
        default: "percent",
        baseKey: "price",
        options: [
          { value: "percent", label: "%", format: "percent", min: 0, max: 10, step: 0.05 },
          { value: "amount", label: "$", format: "currency", min: 0, max: 500_000, step: 100 },
        ],
      },
    },
    { key: "insurance", label: "Homeowners insurance (annual)", type: "number", format: "currency", default: 1_500, min: 0, max: 100_000, step: 100, group: "costs" },
    { key: "hoa", label: "HOA dues (monthly)", type: "number", format: "currency", default: 0, min: 0, max: 10_000, step: 25, group: "costs", optional: true },
    { key: "ufmip", label: "Upfront MIP", type: "number", format: "percent", default: FHA_RULES.upfrontMipPercent, min: 0, max: 5, step: 0.05, group: "mip", help: "Percent of the base loan amount." },
    { key: "financeUfmip", label: "Add upfront MIP to the loan", type: "toggle", default: true, group: "mip", help: "Most borrowers finance it instead of paying cash at closing." },
    {
      key: "mipMode",
      label: "Annual MIP rate",
      type: "select",
      display: "segmented",
      default: "auto",
      group: "mip",
      fullWidth: true,
      options: [
        { value: "auto", label: "Use HUD table" },
        { value: "custom", label: "Enter my own" },
      ],
    },
    { key: "mipRate", label: "Custom annual MIP", type: "number", format: "percent", default: 0.55, min: 0, max: 2, step: 0.05, group: "mip", visibleWhen: (v) => v.mipMode === "custom" },
  ],
  validate: (v) => {
    if (amountFromUnit(v.down, v.downUnit, v.price) >= v.price) return { down: "Down payment must be less than the purchase price." };
    return {};
  },
  compute: (v) => {
    const downPayment = amountFromUnit(v.down, v.downUnit, v.price);
    const r = calculateFha({
      price: v.price,
      downPayment,
      ratePercent: v.rate,
      termYears: Number(v.term),
      propertyTaxAnnual: amountFromUnit(v.tax, v.taxUnit, v.price),
      insuranceAnnual: v.insurance,
      hoaMonthly: v.hoa,
      upfrontMipPercent: v.ufmip,
      annualMipPercent: v.mipMode === "custom" ? v.mipRate : undefined,
      financeUpfrontMip: v.financeUfmip,
    });

    const warnings: string[] = [];
    if (!r.meetsMinimumDown) warnings.push(`FHA loans require at least ${FHA_RULES.minDownPaymentPercent}% down for most borrowers (10% with credit scores of 500–579).`);
    warnings.push("FHA loan limits vary by county. Check that this loan amount is within your area's limit.");

    const mipLifetime = r.mipMonths >= Number(v.term) * 12;
    return {
      primary: { label: "Estimated monthly payment", value: r.totalMonthlyPayment, format: "currency", hint: "Principal, interest, MIP, taxes, insurance and HOA (first year)" },
      secondary: [
        { label: "Principal & interest", value: r.monthlyPrincipalAndInterest, format: "currency" },
        { label: "Monthly MIP (year 1)", value: r.monthlyMipFirstYear, format: "currency", hint: `${formatPercent(r.annualMipPercent)} annual rate` },
        { label: "Property tax", value: r.monthlyTax, format: "currency", hint: "per month" },
        { label: "Homeowners insurance", value: r.monthlyInsurance, format: "currency", hint: "per month" },
        { label: "Upfront MIP", value: r.upfrontMip, format: "currency", hint: v.financeUfmip ? "added to the loan" : "paid at closing" },
        { label: "Total loan amount", value: r.totalLoan, format: "currencyWhole", hint: `Base loan ${formatCurrency(r.baseLoan, 0)}` },
        { label: "Total interest paid", value: r.totalInterest, format: "currencyWhole" },
        { label: "Total annual MIP paid", value: r.totalMip, format: "currencyWhole", hint: mipLifetime ? "for the life of the loan" : `for ${formatMonths(r.mipMonths)}` },
      ],
      charts: [
        {
          id: "breakdown",
          title: "Monthly payment breakdown",
          kind: "donut",
          xKey: "label",
          series: [{ key: "value", label: "Amount" }],
          data: [
            { label: "Principal & interest", value: r.monthlyPrincipalAndInterest },
            { label: "Mortgage insurance", value: r.monthlyMipFirstYear },
            { label: "Property tax", value: r.monthlyTax },
            { label: "Insurance", value: r.monthlyInsurance },
            { label: "HOA", value: v.hoa },
          ].filter((d) => d.value > 0),
          valueFormat: "currency",
        },
        balanceChart(r.schedule),
      ],
      tables: [amortizationTable(r.schedule, { showInsurance: true, insuranceLabel: "MIP", downPayment })],
      insights: [
        `With ${formatPercent(100 - r.ltvPercent, 2)} down, your loan-to-value is ${formatPercent(r.ltvPercent, 2)}, so annual MIP ${mipLifetime ? "stays for the life of the loan unless you refinance" : `ends after ${formatMonths(r.mipMonths)}`}.`,
        `Mortgage insurance adds about ${formatCurrency(r.totalMip + r.upfrontMip, 0)} over the loan, including the ${formatCurrency(r.upfrontMip, 0)} upfront premium.`,
        "MIP is recalculated each year on the declining balance, so the monthly amount falls slowly over time.",
      ],
      warnings,
    };
  },
});
