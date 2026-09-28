import type { ChartSpec, TableSpec } from "../types";

export interface GrowthInput {
  initial: number;
  /** Periodic (monthly) growth rate as a decimal. */
  monthlyRate: number;
  months: number;
  /** Contribution made in a given 1-based month. */
  contribution: (month: number) => number;
  /** "end" = ordinary annuity (default), "start" = annuity due. */
  timing?: "start" | "end";
}

export interface GrowthYear {
  year: number;
  contributions: number; // contributed during the year
  growth: number; // interest/returns earned during the year
  totalContributions: number; // initial + all contributions to date
  totalGrowth: number;
  balance: number;
}

export interface GrowthResult {
  balance: number;
  totalContributions: number; // excludes the initial amount
  totalGrowth: number;
  years: GrowthYear[];
}

/** Month-by-month simulation of a balance with contributions and compounding. */
export function simulateGrowth({ initial, monthlyRate, months, contribution, timing = "end" }: GrowthInput): GrowthResult {
  let balance = initial;
  let totalContributions = 0;
  let totalGrowth = 0;
  const years: GrowthYear[] = [];
  let yearContrib = 0;
  let yearGrowth = 0;

  for (let month = 1; month <= months; month++) {
    const deposit = contribution(month);
    if (timing === "start") balance += deposit;
    const growth = balance * monthlyRate;
    balance += growth;
    if (timing === "end") balance += deposit;
    totalContributions += deposit;
    totalGrowth += growth;
    yearContrib += deposit;
    yearGrowth += growth;
    if (month % 12 === 0 || month === months) {
      years.push({
        year: Math.ceil(month / 12),
        contributions: yearContrib,
        growth: yearGrowth,
        totalContributions: initial + totalContributions,
        totalGrowth,
        balance,
      });
      yearContrib = 0;
      yearGrowth = 0;
    }
  }
  return { balance, totalContributions, totalGrowth, years };
}

export function growthChart(years: GrowthYear[], labels = { contributions: "Contributions", growth: "Growth" }): ChartSpec {
  return {
    id: "growth",
    title: "Balance over time",
    description: "How much of the balance comes from your money versus growth.",
    kind: "stacked-bar",
    xKey: "year",
    xLabel: "Year",
    series: [
      { key: "contributions", label: labels.contributions, color: 1 },
      { key: "growth", label: labels.growth, color: 2 },
    ],
    data: years.map((y) => ({ year: y.year, contributions: y.totalContributions, growth: y.totalGrowth })),
    valueFormat: "currencyWhole",
  };
}

export function growthTable(years: GrowthYear[], growthLabel = "Growth"): TableSpec {
  return {
    id: "yearly",
    title: "Year-by-year breakdown",
    views: [
      {
        id: "yearly",
        label: "Yearly",
        columns: [
          { key: "year", label: "Year", format: "integer" },
          { key: "contributions", label: "Contributions", format: "currencyWhole" },
          { key: "growth", label: growthLabel, format: "currencyWhole" },
          { key: "totalGrowth", label: `Total ${growthLabel.toLowerCase()}`, format: "currencyWhole" },
          { key: "balance", label: "Ending balance", format: "currencyWhole" },
        ],
        rows: years.map((y) => ({ ...y })),
        initialRows: 30,
      },
    ],
  };
}
