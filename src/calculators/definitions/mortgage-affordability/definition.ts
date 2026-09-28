import { formatCurrency, formatPercent } from "@/lib/format";
import { defineCalculator } from "../../types";
import { calculateAffordability, DTI_SCENARIOS, type AffordabilityInput } from "./logic";

type Values = {
  income: number;
  debts: number;
  down: number;
  rate: number;
  term: string;
  tax: number;
  insurance: number;
  hoa: number;
  pmi: number;
  front: number;
  back: number;
};

export default defineCalculator<Values>({
  slug: "mortgage-affordability",
  groups: [
    { id: "you", label: "Your finances" },
    { id: "loan", label: "Loan & home costs" },
    { id: "ratios", label: "Debt-to-income limits", collapsible: true, description: "The maximum share of gross income for housing (front-end) and for housing plus debts (back-end)." },
  ],
  fields: [
    { key: "income", label: "Annual household income", type: "number", format: "currency", default: 100_000, min: 1_000, max: 100_000_000, step: 1_000, group: "you", help: "Gross income before taxes." },
    { key: "debts", label: "Monthly debt payments", type: "number", format: "currency", default: 500, min: 0, max: 1_000_000, step: 25, group: "you", optional: true, help: "Car, student loan, card minimums, child support." },
    { key: "down", label: "Down payment", type: "number", format: "currency", default: 40_000, min: 0, max: 100_000_000, step: 1_000, group: "you", optional: true },
    { key: "rate", label: "Interest rate", type: "number", format: "percent", default: 6.5, min: 0, max: 20, step: 0.125, group: "loan" },
    {
      key: "term",
      label: "Loan term",
      type: "select",
      display: "segmented",
      default: "30",
      group: "loan",
      options: [
        { value: "30", label: "30 years" },
        { value: "20", label: "20 years" },
        { value: "15", label: "15 years" },
      ],
    },
    { key: "tax", label: "Property tax rate (annual)", type: "number", format: "percent", default: 1.1, min: 0, max: 10, step: 0.05, group: "loan" },
    { key: "insurance", label: "Homeowners insurance (annual)", type: "number", format: "currency", default: 1_800, min: 0, max: 100_000, step: 100, group: "loan" },
    { key: "hoa", label: "HOA dues (monthly)", type: "number", format: "currency", default: 0, min: 0, max: 10_000, step: 25, group: "loan", optional: true },
    { key: "pmi", label: "PMI rate (annual)", type: "number", format: "percent", default: 0.5, min: 0, max: 3, step: 0.05, group: "loan", help: "Applied when the loan is over 80% of the price." },
    { key: "front", label: "Housing ratio (front-end)", type: "number", format: "percent", default: 28, min: 5, max: 60, step: 1, group: "ratios" },
    { key: "back", label: "Total debt ratio (back-end)", type: "number", format: "percent", default: 36, min: 5, max: 65, step: 1, group: "ratios" },
  ],
  validate: (v) => (v.back < v.front ? { back: "The back-end ratio should be at least the front-end ratio." } : {}),
  compute: (v) => {
    const input: AffordabilityInput = {
      annualIncome: v.income,
      monthlyDebts: v.debts,
      downPayment: v.down,
      ratePercent: v.rate,
      termYears: Number(v.term),
      propertyTaxPercent: v.tax,
      insuranceAnnual: v.insurance,
      hoaMonthly: v.hoa,
      pmiRatePercent: v.pmi,
      frontEndRatio: v.front,
      backEndRatio: v.back,
    };
    const r = calculateAffordability(input);
    const scenarios = DTI_SCENARIOS.map((s) => {
      const result = calculateAffordability({ ...input, frontEndRatio: s.front, backEndRatio: s.back });
      return { scenario: s.label, ratios: `${s.front}% / ${s.back}%`, price: result.maxPrice, payment: result.affordable ? result.payment.total : 0 };
    });

    if (!r.affordable) {
      return {
        primary: { label: "Maximum home price", value: 0, format: "currencyWhole", tone: "negative" },
        secondary: [{ label: "Housing budget", value: r.maxHousingPayment, format: "currency" }],
        warnings: ["With these debts and ratios there is no room in the budget for a housing payment. Reducing monthly debts has the largest effect."],
      };
    }

    const downPercent = r.maxPrice > 0 ? (v.down / r.maxPrice) * 100 : 0;
    return {
      primary: { label: "You can afford a home up to", value: r.maxPrice, format: "currencyWhole", hint: `With ${formatCurrency(v.down, 0)} down (${formatPercent(downPercent, 1)})` },
      secondary: [
        { label: "Monthly payment", value: r.payment.total, format: "currency", hint: "Principal, interest, tax, insurance, PMI, HOA" },
        { label: "Loan amount", value: r.loanAmount, format: "currencyWhole" },
        { label: "Principal & interest", value: r.payment.principalAndInterest, format: "currency" },
        { label: "Taxes & insurance", value: r.payment.tax + r.payment.insurance, format: "currency", hint: "per month" },
        { label: "PMI", value: r.payment.pmi, format: "currency", hint: r.payment.pmi > 0 ? "down payment under 20%" : "not required" },
        { label: "Limited by", value: r.limitingRatio === "front-end" ? v.front : v.back, format: "percent", hint: r.limitingRatio === "front-end" ? "housing ratio" : "total debt ratio" },
      ],
      tables: [
        {
          id: "scenarios",
          title: "Affordability at different debt-to-income limits",
          views: [
            {
              id: "all",
              label: "Scenarios",
              columns: [
                { key: "scenario", label: "Scenario", align: "left" },
                { key: "ratios", label: "Front / back", align: "right" },
                { key: "price", label: "Max price", format: "currencyWhole" },
                { key: "payment", label: "Monthly payment", format: "currency" },
              ],
              rows: scenarios,
            },
          ],
        },
      ],
      insights: [
        r.limitingRatio === "back-end"
          ? `Your other debts are the binding constraint: ${formatCurrency(v.debts, 0)} a month of debt payments reduces your housing budget to ${formatCurrency(r.maxHousingPayment, 0)}.`
          : `Your housing ratio is the binding constraint: ${formatPercent(v.front, 0)} of monthly income allows ${formatCurrency(r.maxHousingPayment, 0)} for housing.`,
        "This is the most a typical guideline allows — not necessarily what's comfortable. Consider savings goals, childcare and other costs that lenders don't count.",
      ],
      warnings: v.down < r.maxPrice * 0.03 ? ["Most loan programs require at least 3–3.5% down."] : [],
    };
  },
});
