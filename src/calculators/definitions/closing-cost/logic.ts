export interface ClosingCostInput {
  price: number;
  downPayment: number;
  ratePercent: number;
  originationPercent: number; // % of loan
  discountPoints: number; // points, each = 1% of loan
  appraisal: number;
  creditReport: number;
  otherLenderFees: number;
  titleInsurancePercent: number; // % of price
  settlementFee: number;
  recordingFees: number;
  transferTaxPercent: number; // % of price paid by buyer
  inspection: number;
  prepaidInterestDays: number;
  insuranceAnnual: number;
  insuranceMonthsPrepaid: number;
  propertyTaxPercent: number; // annual % of price
  taxEscrowMonths: number;
  other: number;
}

export interface ClosingCostGroup {
  id: "lender" | "title" | "services" | "prepaids";
  label: string;
  items: { label: string; amount: number }[];
  total: number;
}

export interface ClosingCostResult {
  loanAmount: number;
  groups: ClosingCostGroup[];
  total: number;
  percentOfPrice: number;
  cashToClose: number;
}

/** Sums itemized buyer closing costs. Prepaid interest uses a 365-day year. */
export function calculateClosingCosts(i: ClosingCostInput): ClosingCostResult {
  const loanAmount = Math.max(0, i.price - i.downPayment);
  const group = (id: ClosingCostGroup["id"], label: string, items: { label: string; amount: number }[]): ClosingCostGroup => ({
    id,
    label,
    items,
    total: items.reduce((sum, item) => sum + item.amount, 0),
  });

  const groups = [
    group("lender", "Lender fees", [
      { label: "Origination fee", amount: (loanAmount * i.originationPercent) / 100 },
      { label: "Discount points", amount: (loanAmount * i.discountPoints) / 100 },
      { label: "Appraisal", amount: i.appraisal },
      { label: "Credit report", amount: i.creditReport },
      { label: "Underwriting & other lender fees", amount: i.otherLenderFees },
    ]),
    group("title", "Title & government", [
      { label: "Title insurance", amount: (i.price * i.titleInsurancePercent) / 100 },
      { label: "Settlement / escrow fee", amount: i.settlementFee },
      { label: "Recording fees", amount: i.recordingFees },
      { label: "Transfer taxes", amount: (i.price * i.transferTaxPercent) / 100 },
    ]),
    group("services", "Other services", [
      { label: "Home inspection", amount: i.inspection },
      { label: "Other costs", amount: i.other },
    ]),
    group("prepaids", "Prepaids & escrow", [
      { label: "Prepaid interest", amount: ((loanAmount * i.ratePercent) / 100 / 365) * i.prepaidInterestDays },
      { label: "Homeowners insurance (prepaid)", amount: (i.insuranceAnnual / 12) * i.insuranceMonthsPrepaid },
      { label: "Property tax escrow deposit", amount: ((i.price * i.propertyTaxPercent) / 100 / 12) * i.taxEscrowMonths },
    ]),
  ];

  const total = groups.reduce((sum, g) => sum + g.total, 0);
  return { loanAmount, groups, total, percentOfPrice: i.price > 0 ? (total / i.price) * 100 : 0, cashToClose: i.downPayment + total };
}
