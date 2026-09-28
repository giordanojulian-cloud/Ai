export interface RoiInput {
  invested: number;
  finalValue: number;
  /** Dividends, rent or other cash received while holding. */
  income: number;
  /** Fees, commissions and other costs added to the investment. */
  costs: number;
  /** Holding period in years; 0 skips annualization. */
  years: number;
}

export interface RoiResult {
  totalCost: number;
  totalReturn: number;
  gain: number;
  roiPercent: number;
  annualizedPercent: number | null;
}

/**
 * ROI = (final value + income − invested − costs) ÷ (invested + costs)
 * Annualized ROI (CAGR) = (1 + ROI)^(1 / years) − 1
 */
export function calculateRoi({ invested, finalValue, income, costs, years }: RoiInput): RoiResult {
  const totalCost = invested + costs;
  const totalReturn = finalValue + income;
  const gain = totalReturn - totalCost;
  const roi = totalCost > 0 ? gain / totalCost : 0;
  const annualized = years > 0 && 1 + roi > 0 ? (1 + roi) ** (1 / years) - 1 : years > 0 ? -1 : null;
  return { totalCost, totalReturn, gain, roiPercent: roi * 100, annualizedPercent: annualized === null ? null : annualized * 100 };
}
