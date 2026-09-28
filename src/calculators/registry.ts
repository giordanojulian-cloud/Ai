/**
 * Pure helpers over calculator metadata. They take the list to operate on so
 * the same logic works for code defaults and for admin-merged catalogs.
 */
import type { CategorySlug } from "./categories";
import { calculatorMetas, contentLoaders, definitionLoaders } from "./registry.generated";
import type { CalculatorContent, CalculatorDefinition, CalculatorMeta, CalculatorValues } from "./types";

export { calculatorMetas };

export function isPublished(meta: CalculatorMeta): boolean {
  return (meta.status ?? "published") === "published";
}

export function findCalculator<T extends CalculatorMeta>(list: readonly T[], slug: string): T | undefined {
  return list.find((meta) => meta.slug === slug);
}

export function inCategory(meta: CalculatorMeta, category: CategorySlug): boolean {
  return meta.category === category || (meta.secondaryCategories?.includes(category) ?? false);
}

/** Primary-category calculators first, then secondary listings, each by popularity. */
export function calculatorsInCategory<T extends CalculatorMeta>(list: readonly T[], category: CategorySlug): T[] {
  return sortByPopularity(list.filter((meta) => inCategory(meta, category))).sort(
    (a, b) => Number(b.category === category) - Number(a.category === category),
  );
}

export function sortByPopularity<T extends CalculatorMeta>(list: readonly T[]): T[] {
  return [...list].sort(
    (a, b) => (a.popularity ?? Number.MAX_SAFE_INTEGER) - (b.popularity ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name),
  );
}

export function sortByRecent<T extends CalculatorMeta>(list: readonly T[]): T[] {
  return [...list].sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name));
}

export function sortByName<T extends CalculatorMeta>(list: readonly T[]): T[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Discovery engine. Explicit `related` links always come first, in order.
 * Remaining slots are filled by a relevance score:
 *   +4 candidate links back to this calculator
 *   +3 same primary category
 *   +2 categories overlap otherwise
 *   +1 per shared keyword
 * Ties break on popularity so strong pages accumulate internal links.
 */
export function relatedCalculators<T extends CalculatorMeta>(list: readonly T[], meta: CalculatorMeta, limit = 6): T[] {
  const bySlug = new Map(list.map((m) => [m.slug, m]));
  const explicit = meta.related.map((slug) => bySlug.get(slug)).filter((m): m is T => Boolean(m) && m!.slug !== meta.slug);
  if (explicit.length >= limit) return explicit.slice(0, limit);

  const chosen = new Set(explicit.map((m) => m.slug));
  const myCategories = new Set([meta.category, ...(meta.secondaryCategories ?? [])]);
  const myKeywords = new Set(meta.keywords.map((k) => k.toLowerCase()));

  const scored = list
    .filter((candidate) => candidate.slug !== meta.slug && !chosen.has(candidate.slug))
    .map((candidate) => {
      let score = 0;
      if (candidate.related.includes(meta.slug)) score += 4;
      if (candidate.category === meta.category) score += 3;
      else if ([candidate.category, ...(candidate.secondaryCategories ?? [])].some((c) => myCategories.has(c))) score += 2;
      score += candidate.keywords.filter((k) => myKeywords.has(k.toLowerCase())).length;
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.candidate.popularity ?? Number.MAX_SAFE_INTEGER) - (b.candidate.popularity ?? Number.MAX_SAFE_INTEGER),
    );

  return [...explicit, ...scored.map(({ candidate }) => candidate)].slice(0, limit);
}

export async function loadCalculatorContent(slug: string): Promise<CalculatorContent | undefined> {
  const loader = contentLoaders[slug];
  return loader ? (await loader()).default : undefined;
}

export async function loadCalculatorDefinition(slug: string): Promise<CalculatorDefinition<CalculatorValues> | undefined> {
  const loader = definitionLoaders[slug];
  return loader ? ((await loader()).default as CalculatorDefinition<CalculatorValues>) : undefined;
}

export function hasImplementation(slug: string): boolean {
  return slug in definitionLoaders;
}
