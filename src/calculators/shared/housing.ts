import { amortizationSchedule, loanPayment, type AmortizationRow } from "@/lib/finance";
import type { ChartSpec, TableSpec } from "../types";

/** Converts a "$ or %" input into dollars. Percent values are a percent of `base`. */
export function amountFromUnit(value: number, unit: string, base: number): number {
  return unit === "percent" ? (value / 100) * base : value;
}

export interface HousingScheduleInput {
  loanAmount: number;
  ratePercent: number;
  termMonths: number;
  extraMonthly?: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  /** Mortgage insurance charged in a month, given the amortization row for that month. */
  mortgageInsuranceFor?: (row: AmortizationRow, openingBalance: number) => number;
}

export interface HousingRow extends AmortizationRow {
  mortgageInsurance: number;
}

export interface HousingSchedule {
  rows: HousingRow[];
  monthlyPrincipalAndInterest: number;
  totals: {
    principal: number;
    interest: number;
    extraPrincipal: number;
    mortgageInsurance: number;
    tax: number;
    insurance: number;
    hoa: number;
  };
  /** Number of months in which mortgage insurance was charged. */
  mortgageInsuranceMonths: number;
}

/**
 * Builds a full housing-cost schedule. Taxes, insurance and HOA are assumed to
 * stay flat for the life of the loan (they are charged for every month the
 * loan is outstanding).
 */
export function buildHousingSchedule(input: HousingScheduleInput): HousingSchedule {
  const amortization = amortizationSchedule(input.loanAmount, input.ratePercent, input.termMonths, {
    extraMonthly: input.extraMonthly,
  });
  let opening = input.loanAmount;
  let miMonths = 0;
  const totals = { principal: 0, interest: 0, extraPrincipal: 0, mortgageInsurance: 0, tax: 0, insurance: 0, hoa: 0 };

  const rows: HousingRow[] = amortization.map((row) => {
    const mi = input.mortgageInsuranceFor?.(row, opening) ?? 0;
    if (mi > 0) miMonths++;
    opening = row.balance;
    totals.principal += row.principal;
    totals.interest += row.interest;
    totals.extraPrincipal += row.extraPrincipal;
    totals.mortgageInsurance += mi;
    totals.tax += input.monthlyTax;
    totals.insurance += input.monthlyInsurance;
    totals.hoa += input.monthlyHoa;
    return { ...row, mortgageInsurance: mi };
  });

  return {
    rows,
    monthlyPrincipalAndInterest: loanPayment(input.loanAmount, input.ratePercent, input.termMonths),
    totals,
    mortgageInsuranceMonths: miMonths,
  };
}

/** Monthly / annual / full-term amortization table shared by mortgage-style calculators. */
export function amortizationTable(
  schedule: HousingSchedule,
  options: { insuranceLabel?: string; showInsurance: boolean; downPayment?: number },
): TableSpec {
  const miLabel = options.insuranceLabel ?? "PMI";
  const showMi = options.showInsurance;
  const hasExtra = schedule.totals.extraPrincipal > 0;

  const monthlyColumns = [
    { key: "period", label: "Month", format: "integer" as const },
    { key: "payment", label: "Principal & interest", format: "currency" as const },
    { key: "principal", label: "Principal", format: "currency" as const },
    ...(hasExtra ? [{ key: "extra", label: "Extra", format: "currency" as const }] : []),
    { key: "interest", label: "Interest", format: "currency" as const },
    ...(showMi ? [{ key: "mi", label: miLabel, format: "currency" as const }] : []),
    { key: "balance", label: "Balance", format: "currency" as const },
  ];

  const monthlyRows = schedule.rows.map((row) => ({
    period: row.period,
    payment: row.payment,
    principal: row.principal,
    extra: row.extraPrincipal,
    interest: row.interest,
    mi: row.mortgageInsurance,
    balance: row.balance,
  }));

  type AnnualRow = { period: number; payment: number; principal: number; extra: number; interest: number; mi: number; balance: number };
  const annualRows: AnnualRow[] = [];
  for (const row of schedule.rows) {
    const index = Math.ceil(row.period / 12) - 1;
    const year = (annualRows[index] ??= { period: index + 1, payment: 0, principal: 0, extra: 0, interest: 0, mi: 0, balance: 0 });
    year.payment += row.payment;
    year.principal += row.principal;
    year.extra += row.extraPrincipal;
    year.interest += row.interest;
    year.mi += row.mortgageInsurance;
    year.balance = row.balance;
  }

  const t = schedule.totals;
  const termRows: Record<string, number | string>[] = [
    ...(options.downPayment !== undefined ? [{ item: "Down payment", amount: options.downPayment }] : []),
    { item: "Principal", amount: t.principal + t.extraPrincipal },
    { item: "Interest", amount: t.interest },
    ...(showMi ? [{ item: miLabel, amount: t.mortgageInsurance }] : []),
    { item: "Property taxes", amount: t.tax },
    { item: "Homeowners insurance", amount: t.insurance },
    ...(t.hoa > 0 ? [{ item: "HOA dues", amount: t.hoa }] : []),
  ];
  const termTotal = termRows.reduce((sum, row) => sum + (row.amount as number), 0);

  return {
    id: "amortization",
    title: "Amortization schedule",
    description: "How each payment splits between principal and interest, and the balance remaining.",
    views: [
      {
        id: "annual",
        label: "Annual",
        columns: monthlyColumns.map((c) => (c.key === "period" ? { ...c, label: "Year" } : c)),
        rows: annualRows,
      },
      { id: "monthly", label: "Monthly", columns: monthlyColumns, rows: monthlyRows, initialRows: 24 },
      {
        id: "term",
        label: "Full term",
        columns: [
          { key: "item", label: "Over the life of the loan", align: "left" },
          { key: "amount", label: "Total", format: "currency" },
        ],
        rows: termRows,
        footer: { item: "Total cost", amount: termTotal },
      },
    ],
  };
}

/** Remaining balance and cumulative principal/interest by year. */
export function balanceChart(schedule: HousingSchedule): ChartSpec {
  const data: Record<string, number>[] = [];
  let principal = 0;
  let interest = 0;
  for (const row of schedule.rows) {
    principal += row.principal + row.extraPrincipal;
    interest += row.interest;
    if (row.period % 12 === 0 || row.period === schedule.rows.length) {
      data.push({ year: Math.ceil(row.period / 12), balance: row.balance, principal, interest });
    }
  }
  return {
    id: "balance",
    title: "Loan balance over time",
    description: "Remaining balance versus cumulative principal and interest paid.",
    kind: "line",
    xKey: "year",
    xLabel: "Year",
    series: [
      { key: "balance", label: "Remaining balance", color: 1 },
      { key: "principal", label: "Principal paid", color: 2 },
      { key: "interest", label: "Interest paid", color: 3 },
    ],
    data,
    valueFormat: "currencyWhole",
  };
}
