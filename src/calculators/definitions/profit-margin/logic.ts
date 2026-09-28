import { marginFromPriceCost, markupFromPriceCost } from "../../shared/pricing";

export interface ProfitInput {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  /** Income tax rate applied to positive operating profit (interest is not modeled). */
  taxRatePercent: number;
}

export interface ProfitResult {
  grossProfit: number;
  grossMargin: number;
  operatingProfit: number;
  operatingMargin: number;
  taxes: number;
  netProfit: number;
  netMargin: number;
  markup: number;
}

export function calculateProfit({ revenue, cogs, operatingExpenses, taxRatePercent }: ProfitInput): ProfitResult {
  const grossProfit = revenue - cogs;
  const operatingProfit = grossProfit - operatingExpenses;
  const taxes = Math.max(0, operatingProfit) * (taxRatePercent / 100);
  const netProfit = operatingProfit - taxes;
  const pct = (value: number) => (revenue !== 0 ? (value / revenue) * 100 : 0);
  return {
    grossProfit,
    grossMargin: marginFromPriceCost(revenue, cogs),
    operatingProfit,
    operatingMargin: pct(operatingProfit),
    taxes,
    netProfit,
    netMargin: pct(netProfit),
    markup: markupFromPriceCost(revenue, cogs),
  };
}
