export interface TipInput {
  subtotal: number; // before tax
  tax: number;
  tipPercent: number;
  people: number;
  roundUp: boolean;
}

export interface TipResult {
  tip: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
}

/**
 * Tip is calculated on the pre-tax subtotal. With rounding, each person's
 * share is rounded up to the next whole dollar and the extra goes to the tip.
 */
export function calculateTip({ subtotal, tax, tipPercent, people, roundUp }: TipInput): TipResult {
  const baseTip = (subtotal * tipPercent) / 100;
  const rawTotal = subtotal + tax + baseTip;
  const perPersonRaw = rawTotal / people;
  const perPerson = roundUp ? Math.ceil(perPersonRaw - 1e-9) : perPersonRaw;
  const total = perPerson * people;
  const tip = total - subtotal - tax;
  return { tip, total, perPerson, tipPerPerson: tip / people };
}
