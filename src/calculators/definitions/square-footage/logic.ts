export const SQ_FT_TO_SQ_M = 0.09290304;

/** Sum of rectangular areas given as [length, width] pairs. */
export function totalArea(dimensions: [number, number][]): number {
  return dimensions.reduce((sum, [l, w]) => sum + l * w, 0);
}
