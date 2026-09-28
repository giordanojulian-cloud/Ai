/** Published yields for pre-mixed concrete bags, in cubic feet per bag. */
export const BAG_YIELD_CUBIC_FEET = { 80: 0.6, 60: 0.45, 40: 0.3 } as const;
export const CUBIC_FEET_PER_YARD = 27;

export type ConcreteShape = "slab" | "column";

export interface ConcreteInput {
  shape: ConcreteShape;
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  diameterIn: number;
  heightFt: number;
  quantity: number;
  wastePercent: number;
}

export interface ConcreteResult {
  cubicFeet: number; // before waste
  cubicFeetWithWaste: number;
  cubicYards: number; // with waste
  cubicMeters: number; // with waste
  bags: Record<keyof typeof BAG_YIELD_CUBIC_FEET, number>;
}

export function calculateConcrete(i: ConcreteInput): ConcreteResult {
  const each =
    i.shape === "slab" ? i.lengthFt * i.widthFt * (i.thicknessIn / 12) : Math.PI * (i.diameterIn / 24) ** 2 * i.heightFt;
  const cubicFeet = each * i.quantity;
  const cubicFeetWithWaste = cubicFeet * (1 + i.wastePercent / 100);
  return {
    cubicFeet,
    cubicFeetWithWaste,
    cubicYards: cubicFeetWithWaste / CUBIC_FEET_PER_YARD,
    cubicMeters: cubicFeetWithWaste * 0.028316846592,
    bags: {
      80: Math.ceil(cubicFeetWithWaste / BAG_YIELD_CUBIC_FEET[80] - 1e-9),
      60: Math.ceil(cubicFeetWithWaste / BAG_YIELD_CUBIC_FEET[60] - 1e-9),
      40: Math.ceil(cubicFeetWithWaste / BAG_YIELD_CUBIC_FEET[40] - 1e-9),
    },
  };
}
