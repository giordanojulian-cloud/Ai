export interface BreakEvenInput {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  targetProfit: number;
}

export interface BreakEvenResult {
  contributionMargin: number;
  contributionMarginRatio: number; // percent
  breakEvenUnits: number; // exact (fractional)
  breakEvenRevenue: number;
  unitsForTarget: number;
  revenueForTarget: number;
  viable: boolean;
}

/**
 * Break-even units = Fixed costs ÷ (Price − Variable cost per unit).
 * Break-even revenue = Fixed costs ÷ contribution margin ratio.
 */
export function calculateBreakEven({ fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit }: BreakEvenInput): BreakEvenResult {
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const viable = contributionMargin > 0;
  const breakEvenUnits = viable ? fixedCosts / contributionMargin : Infinity;
  const unitsForTarget = viable ? (fixedCosts + targetProfit) / contributionMargin : Infinity;
  return {
    contributionMargin,
    contributionMarginRatio: pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0,
    breakEvenUnits,
    breakEvenRevenue: breakEvenUnits * pricePerUnit,
    unitsForTarget,
    revenueForTarget: unitsForTarget * pricePerUnit,
    viable,
  };
}
