export type PercentageMode = "of" | "is-what-percent" | "change" | "adjust";

export interface PercentageResult {
  value: number;
  isPercent: boolean;
  expression: string;
}

/**
 * of:              X% of Y            = X/100 × Y
 * is-what-percent: X is what % of Y   = X ÷ Y × 100
 * change:          % change X → Y     = (Y − X) ÷ |X| × 100
 * adjust:          Y increased by X%  = Y × (1 + X/100)
 */
export function percentage(mode: PercentageMode, a: number, b: number): PercentageResult | null {
  switch (mode) {
    case "of":
      return { value: (a / 100) * b, isPercent: false, expression: `${a}% × ${b}` };
    case "is-what-percent":
      return b === 0 ? null : { value: (a / b) * 100, isPercent: true, expression: `${a} ÷ ${b} × 100` };
    case "change":
      return a === 0 ? null : { value: ((b - a) / Math.abs(a)) * 100, isPercent: true, expression: `(${b} − ${a}) ÷ |${a}| × 100` };
    case "adjust":
      return { value: b * (1 + a / 100), isPercent: false, expression: `${b} × (1 + ${a}/100)` };
  }
}
