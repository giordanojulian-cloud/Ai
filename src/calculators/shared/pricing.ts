/** Margin and markup conversions shared by the profit margin and markup calculators. Percent in, percent out. */

/** Margin = (price − cost) ÷ price. */
export function marginFromPriceCost(price: number, cost: number): number {
  return price !== 0 ? ((price - cost) / price) * 100 : 0;
}

/** Markup = (price − cost) ÷ cost. */
export function markupFromPriceCost(price: number, cost: number): number {
  return cost !== 0 ? ((price - cost) / cost) * 100 : 0;
}

export function priceFromMarkup(cost: number, markupPercent: number): number {
  return cost * (1 + markupPercent / 100);
}

/** Price = cost ÷ (1 − margin). Margin must be below 100%. */
export function priceFromMargin(cost: number, marginPercent: number): number {
  return cost / (1 - marginPercent / 100);
}

export function markupToMargin(markupPercent: number): number {
  return (markupPercent / (100 + markupPercent)) * 100;
}

export function marginToMarkup(marginPercent: number): number {
  return (marginPercent / (100 - marginPercent)) * 100;
}
