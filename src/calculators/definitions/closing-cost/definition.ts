import { formatCurrency, formatPercent } from "@/lib/format";
import { amountFromUnit } from "../../shared/housing";
import { defineCalculator } from "../../types";
import { calculateClosingCosts } from "./logic";

type Values = {
  price: number;
  down: number;
  downUnit: string;
  rate: number;
  origination: number;
  points: number;
  appraisal: number;
  creditReport: number;
  lenderFees: number;
  title: number;
  settlement: number;
  recording: number;
  transferTax: number;
  inspection: number;
  interestDays: number;
  insurance: number;
  insuranceMonths: number;
  propertyTax: number;
  taxMonths: number;
  other: number;
};

const money = (key: keyof Values & string, label: string, def: number, group: string, help?: string) =>
  ({ key, label, type: "number", format: "currency", default: def, min: 0, max: 10_000_000, step: 25, group, optional: true, help }) as const;
const pct = (key: keyof Values & string, label: string, def: number, group: string, max: number, help?: string) =>
  ({ key, label, type: "number", format: "percent", default: def, min: 0, max, step: 0.05, group, optional: true, help }) as const;

export default defineCalculator<Values>({
  slug: "closing-cost",
  groups: [
    { id: "loan", label: "Purchase & loan" },
    { id: "lender", label: "Lender fees", collapsible: true },
    { id: "title", label: "Title & government fees", collapsible: true },
    { id: "services", label: "Inspections & other", collapsible: true },
    { id: "prepaids", label: "Prepaids & escrow", collapsible: true },
  ],
  fields: [
    { key: "price", label: "Home price", type: "number", format: "currency", default: 400_000, min: 1_000, max: 100_000_000, step: 1_000, group: "loan" },
    {
      key: "down",
      label: "Down payment",
      type: "number",
      format: "percent",
      default: 20,
      min: 0,
      group: "loan",
      unit: {
        key: "downUnit",
        default: "percent",
        baseKey: "price",
        options: [
          { value: "percent", label: "%", format: "percent", min: 0, max: 100, step: 0.5 },
          { value: "amount", label: "$", format: "currency", min: 0, max: 100_000_000, step: 1_000 },
        ],
      },
    },
    { key: "rate", label: "Interest rate", type: "number", format: "percent", default: 6.5, min: 0, max: 20, step: 0.125, group: "loan" },
    pct("origination", "Origination fee", 1, "lender", 5, "Percent of the loan amount."),
    { key: "points", label: "Discount points", type: "number", format: "number", default: 0, min: 0, max: 5, step: 0.125, group: "lender", optional: true, help: "Each point costs 1% of the loan." },
    money("appraisal", "Appraisal", 600, "lender"),
    money("creditReport", "Credit report", 50, "lender"),
    money("lenderFees", "Underwriting & other lender fees", 1_000, "lender"),
    pct("title", "Title insurance", 0.5, "title", 3, "Percent of the price. Varies widely by state."),
    money("settlement", "Settlement / escrow fee", 750, "title"),
    money("recording", "Recording fees", 250, "title"),
    pct("transferTax", "Transfer tax paid by buyer", 0, "title", 5, "Set by your state or city; often paid by the seller."),
    money("inspection", "Home inspection", 450, "services"),
    money("other", "Other costs", 0, "services", "Survey, HOA transfer, attorney fees, etc."),
    { key: "interestDays", label: "Days of prepaid interest", type: "number", format: "integer", default: 15, min: 0, max: 31, step: 1, group: "prepaids", optional: true, help: "From closing to the end of the month." },
    money("insurance", "Homeowners insurance (annual)", 1_800, "prepaids"),
    { key: "insuranceMonths", label: "Months of insurance prepaid", type: "number", format: "integer", default: 12, min: 0, max: 24, step: 1, group: "prepaids", optional: true },
    pct("propertyTax", "Property tax rate (annual)", 1.1, "prepaids", 10),
    { key: "taxMonths", label: "Months of tax escrow deposit", type: "number", format: "integer", default: 3, min: 0, max: 12, step: 1, group: "prepaids", optional: true },
  ],
  validate: (v) => (amountFromUnit(v.down, v.downUnit, v.price) > v.price ? { down: "Down payment can't exceed the home price." } : {}),
  compute: (v) => {
    const downPayment = amountFromUnit(v.down, v.downUnit, v.price);
    const r = calculateClosingCosts({
      price: v.price,
      downPayment,
      ratePercent: v.rate,
      originationPercent: v.origination,
      discountPoints: v.points,
      appraisal: v.appraisal,
      creditReport: v.creditReport,
      otherLenderFees: v.lenderFees,
      titleInsurancePercent: v.title,
      settlementFee: v.settlement,
      recordingFees: v.recording,
      transferTaxPercent: v.transferTax,
      inspection: v.inspection,
      prepaidInterestDays: v.interestDays,
      insuranceAnnual: v.insurance,
      insuranceMonthsPrepaid: v.insuranceMonths,
      propertyTaxPercent: v.propertyTax,
      taxEscrowMonths: v.taxMonths,
      other: v.other,
    });
    const prepaids = r.groups.find((g) => g.id === "prepaids")!.total;
    return {
      primary: { label: "Estimated closing costs", value: r.total, format: "currency", hint: `${formatPercent(r.percentOfPrice)} of the home price` },
      secondary: [
        { label: "Cash needed at closing", value: r.cashToClose, format: "currency", hint: "Down payment + closing costs" },
        { label: "Down payment", value: downPayment, format: "currency" },
        { label: "Loan amount", value: r.loanAmount, format: "currencyWhole" },
        ...r.groups.map((g) => ({ label: g.label, value: g.total, format: "currency" as const })),
      ],
      charts: [
        {
          id: "groups",
          title: "Where closing costs go",
          kind: "donut",
          xKey: "label",
          series: [{ key: "value", label: "Amount" }],
          data: r.groups.filter((g) => g.total > 0).map((g) => ({ label: g.label, value: g.total })),
          valueFormat: "currency",
        },
      ],
      tables: [
        {
          id: "itemized",
          title: "Itemized estimate",
          views: [
            {
              id: "items",
              label: "All items",
              columns: [
                { key: "category", label: "Category", align: "left" },
                { key: "item", label: "Item", align: "left" },
                { key: "amount", label: "Amount", format: "currency" },
              ],
              rows: r.groups.flatMap((g) => g.items.filter((item) => item.amount > 0).map((item) => ({ category: g.label, item: item.label, amount: item.amount }))),
              footer: { category: "Total", item: "", amount: r.total },
            },
          ],
        },
      ],
      insights: [
        `Closing costs add ${formatCurrency(r.total, 0)} — about ${formatPercent(r.percentOfPrice, 1)} of the price — on top of your down payment.`,
        `${formatCurrency(prepaids, 0)} of that is prepaid interest, insurance and tax escrow. These aren't fees: they fund costs you'd pay anyway.`,
        "You can shop for many third-party services, such as title insurance and inspection, and compare lender fees on each Loan Estimate.",
      ],
    };
  },
});
