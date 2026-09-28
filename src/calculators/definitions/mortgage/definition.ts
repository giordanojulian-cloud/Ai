import { formatCurrency, formatMonths, formatPercent } from "@/lib/format";
import { amountFromUnit, amortizationTable, balanceChart } from "../../shared/housing";
import { defineCalculator } from "../../types";
import { calculateMortgage } from "./logic";

type Values = {
  homePrice: number;
  downPayment: number;
  downPaymentUnit: string;
  interestRate: number;
  loanTerm: string;
  propertyTax: number;
  propertyTaxUnit: string;
  insurance: number;
  hoa: number;
  pmiRate: number;
  extraPayment: number;
};

export default defineCalculator<Values>({
  slug: "mortgage",
  groups: [
    { id: "loan", label: "Home & loan" },
    { id: "costs", label: "Taxes, insurance & fees" },
    { id: "advanced", label: "Extra payments", collapsible: true },
  ],
  fields: [
    { key: "homePrice", param: "price", label: "Home price", type: "number", format: "currency", default: 400_000, min: 1_000, max: 100_000_000, step: 1_000, group: "loan" },
    {
      key: "downPayment",
      param: "down",
      label: "Down payment",
      type: "number",
      format: "percent",
      default: 20,
      min: 0,
      group: "loan",
      unit: {
        key: "downPaymentUnit",
        param: "downUnit",
        default: "percent",
        baseKey: "homePrice",
        options: [
          { value: "percent", label: "%", format: "percent", min: 0, max: 99.9, step: 0.5 },
          { value: "amount", label: "$", format: "currency", min: 0, max: 100_000_000, step: 1_000 },
        ],
      },
    },
    { key: "interestRate", param: "rate", label: "Interest rate", type: "number", format: "percent", default: 6.5, min: 0, max: 25, step: 0.125, group: "loan", help: "Annual rate (not APR)." },
    {
      key: "loanTerm",
      param: "term",
      label: "Loan term",
      type: "select",
      default: "30",
      group: "loan",
      options: [
        { value: "30", label: "30 years" },
        { value: "25", label: "25 years" },
        { value: "20", label: "20 years" },
        { value: "15", label: "15 years" },
        { value: "10", label: "10 years" },
      ],
    },
    {
      key: "propertyTax",
      param: "tax",
      label: "Property tax (annual)",
      type: "number",
      format: "percent",
      default: 1.1,
      min: 0,
      group: "costs",
      unit: {
        key: "propertyTaxUnit",
        param: "taxUnit",
        default: "percent",
        baseKey: "homePrice",
        options: [
          { value: "percent", label: "%", format: "percent", min: 0, max: 10, step: 0.05 },
          { value: "amount", label: "$", format: "currency", min: 0, max: 1_000_000, step: 100 },
        ],
      },
    },
    { key: "insurance", param: "ins", label: "Homeowners insurance (annual)", type: "number", format: "currency", default: 1_800, min: 0, max: 200_000, step: 100, group: "costs" },
    { key: "hoa", label: "HOA dues (monthly)", type: "number", format: "currency", default: 0, min: 0, max: 20_000, step: 25, group: "costs" },
    {
      key: "pmiRate",
      param: "pmi",
      label: "PMI rate (annual)",
      type: "number",
      format: "percent",
      default: 0.5,
      min: 0,
      max: 3,
      step: 0.05,
      group: "costs",
      help: "Applied only when the down payment is under 20%. Typical range 0.3–1.5% of the loan.",
    },
    { key: "extraPayment", param: "extra", label: "Extra principal (monthly)", type: "number", format: "currency", default: 0, min: 0, max: 1_000_000, step: 50, group: "advanced", optional: true },
  ],
  validate: (v) => {
    const down = amountFromUnit(v.downPayment, v.downPaymentUnit, v.homePrice);
    if (down >= v.homePrice) return { downPayment: "Down payment must be less than the home price." };
    return {};
  },
  compute: (v) => {
    const downPayment = amountFromUnit(v.downPayment, v.downPaymentUnit, v.homePrice);
    const r = calculateMortgage({
      homePrice: v.homePrice,
      downPayment,
      ratePercent: v.interestRate,
      termYears: Number(v.loanTerm),
      propertyTaxAnnual: amountFromUnit(v.propertyTax, v.propertyTaxUnit, v.homePrice),
      insuranceAnnual: v.insurance,
      hoaMonthly: v.hoa,
      pmiRatePercent: v.pmiRate,
      extraMonthly: v.extraPayment,
    });

    const insights: string[] = [];
    const totalPaidPI = r.schedule.totals.principal + r.schedule.totals.extraPrincipal + r.totalInterest;
    if (totalPaidPI > 0) {
      insights.push(
        `Over the life of the loan, ${formatPercent((r.totalInterest / totalPaidPI) * 100, 0)} of your principal-and-interest payments go to interest (${formatCurrency(r.totalInterest, 0)}).`,
      );
    }
    insights.push(
      `Principal and interest make up ${formatPercent((r.monthlyPrincipalAndInterest / r.totalMonthlyPayment) * 100, 0)} of your estimated monthly payment; the rest is taxes, insurance${r.pmiApplies ? ", PMI" : ""}${v.hoa > 0 ? " and HOA dues" : ""}.`,
    );
    if (r.pmiApplies) {
      insights.push(
        `With ${formatPercent(r.downPaymentPercent, 1)} down, PMI of about ${formatCurrency(r.monthlyPmi)} per month is included until the balance reaches 78% of the home price — roughly ${formatMonths(r.pmiLastMonth)} into the loan.`,
      );
    } else if (r.downPaymentPercent >= 20) {
      insights.push("Your down payment is at least 20%, so private mortgage insurance is not included.");
    }
    if (v.extraPayment > 0) {
      const baseline = calculateMortgage({
        homePrice: v.homePrice,
        downPayment,
        ratePercent: v.interestRate,
        termYears: Number(v.loanTerm),
        propertyTaxAnnual: 0,
        insuranceAnnual: 0,
        hoaMonthly: 0,
        pmiRatePercent: v.pmiRate,
        extraMonthly: 0,
      });
      insights.push(
        `Paying an extra ${formatCurrency(v.extraPayment, 0)} per month saves about ${formatCurrency(baseline.totalInterest - r.totalInterest, 0)} in interest and pays the loan off ${formatMonths(baseline.payoffMonths - r.payoffMonths)} early.`,
      );
    }

    const warnings: string[] = [];
    if (r.ltv > 0.97) warnings.push("Most conventional loans require at least 3% down. Check loan program requirements.");

    return {
      primary: { label: "Estimated monthly payment", value: r.totalMonthlyPayment, format: "currency", hint: "Principal, interest, taxes, insurance, PMI and HOA" },
      secondary: [
        { label: "Principal & interest", value: r.monthlyPrincipalAndInterest, format: "currency" },
        { label: "Property tax", value: r.monthlyTax, format: "currency", hint: "per month" },
        { label: "Homeowners insurance", value: r.monthlyInsurance, format: "currency", hint: "per month" },
        { label: "PMI", value: r.monthlyPmi, format: "currency", hint: r.pmiApplies ? `until month ${r.pmiLastMonth}` : "not required" },
        { label: "HOA dues", value: r.monthlyHoa, format: "currency", hint: "per month" },
        { label: "Loan amount", value: r.loanAmount, format: "currencyWhole", hint: `${formatPercent(r.downPaymentPercent, 1)} down` },
        { label: "Total interest paid", value: r.totalInterest, format: "currencyWhole" },
        { label: "Total cost", value: r.totalCost, format: "currencyWhole", hint: `Down payment plus all payments over ${formatMonths(r.payoffMonths)}` },
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
            { label: "Property tax", value: r.monthlyTax },
            { label: "Insurance", value: r.monthlyInsurance },
            { label: "PMI", value: r.monthlyPmi },
            { label: "HOA", value: r.monthlyHoa },
          ].filter((d) => d.value > 0),
          valueFormat: "currency",
        },
        balanceChart(r.schedule),
      ],
      tables: [amortizationTable(r.schedule, { showInsurance: r.pmiApplies, downPayment })],
      insights,
      warnings,
    };
  },
});
